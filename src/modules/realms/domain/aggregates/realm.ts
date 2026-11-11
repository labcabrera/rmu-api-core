import { RealmCreatedEvent } from '../events/realm-created.event.js';
import { RealmUpdatedEvent } from '../events/realm-updated.event.js';
import { randomUUID } from 'crypto';
import type { RealmGame, RealmProps } from './realm-props.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import { type EntityShare, MAX_SHARES, type ShareLevel } from '../../../shared/domain/entities/entity-share.js';
import { ValidationError } from '../../../shared/domain/errors/errors.js';
import { resolveOwnAccess } from '../../../shared/domain/services/entity-access.js';

type Clearable<T> = { [K in keyof T]?: T[K] | null };

export type RealmUpdate = Partial<Pick<RealmProps, 'name' | 'magicPresence' | 'accessType' | 'generic' | 'entitySource'>> &
  Clearable<Pick<RealmProps, 'shortDescription' | 'description' | 'imageUrl'>>;

export class Realm extends BaseAggregateRoot<RealmProps> {
  private constructor(props: RealmProps) {
    super(props);
  }

  get name() {
    return this.props.name;
  }

  get magicPresence() {
    return this.props.magicPresence;
  }

  get shortDescription() {
    return this.props.shortDescription;
  }

  get description() {
    return this.props.description;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get owner() {
    return this.props.owner;
  }

  get entitySource() {
    return this.props.entitySource;
  }

  get accessType() {
    return this.props.accessType;
  }

  get generic() {
    return this.props.generic;
  }

  get shares(): readonly EntityShare[] {
    return this.props.shares;
  }

  get games(): readonly RealmGame[] {
    return this.props.games;
  }

  get gameReaderIds(): readonly string[] {
    return this.props.gameReaderIds;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt' | 'shares' | 'games' | 'gameReaderIds'>) {
    const realm = new Realm({
      ...props,
      shares: [],
      games: [],
      gameReaderIds: [],
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: undefined,
    });
    realm.apply(new RealmCreatedEvent(realm.getProps()));
    return realm;
  }

  /** The games and their readers are optional: documents and fixtures from before spec 071 have none. */
  static fromProps(props: Omit<RealmProps, 'games' | 'gameReaderIds'> & Partial<Pick<RealmProps, 'games' | 'gameReaderIds'>>) {
    const realm = new Realm({
      ...props,
      shares: [...(props.shares ?? [])],
      games: (props.games ?? []).map(game => ({ ...game, memberIds: [...game.memberIds] })),
      gameReaderIds: [...(props.gameReaderIds ?? [])],
    });
    realm.refreshGameReaders();
    return realm;
  }

  /**
   * Fields left undefined stay as they are. The optional texts are cleared with '' or null; name and magic presence
   * cannot be cleared.
   */
  update(changes: RealmUpdate) {
    if (changes.name) this.props.name = changes.name;
    if (changes.magicPresence) this.props.magicPresence = changes.magicPresence;
    if (changes.shortDescription !== undefined) this.props.shortDescription = changes.shortDescription || undefined;
    if (changes.description !== undefined) this.props.description = changes.description || undefined;
    if (changes.imageUrl !== undefined) this.props.imageUrl = changes.imageUrl || undefined;
    if (changes.accessType) this.props.accessType = changes.accessType;
    if (changes.generic !== undefined) this.props.generic = changes.generic;
    if (changes.entitySource !== undefined) this.props.entitySource = changes.entitySource;
    // The visibility decides whether the owners of the games still read the realm.
    this.refreshGameReaders();
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }

  /**
   * Gives a friend read or write access (spec 069), or changes the level of the one already given. The friendship is
   * checked by the handler. Errors: `share-self` for the owner, `share-limit-reached` past MAX_SHARES.
   */
  share(userId: string, userName: string, level: ShareLevel) {
    if (userId === this.props.owner) throw new ValidationError('The owner already has every access to the realm', 'share-self');
    const current = this.props.shares.find(s => s.userId === userId);
    if (current) {
      if (current.level === level && current.userName === userName) return;
      this.props.shares = this.props.shares.map(s => (s.userId === userId ? { ...s, userName, level } : s));
    } else {
      if (this.props.shares.length >= MAX_SHARES) {
        throw new ValidationError(`A realm is shared with at most ${MAX_SHARES} users`, 'share-limit-reached');
      }
      this.props.shares = [...this.props.shares, { userId, userName, level, grantedAt: new Date() }];
    }
    this.touch();
  }

  /** Removes the access of a user. Removing one that does not exist changes nothing. */
  unshare(userId: string) {
    if (!this.props.shares.some(s => s.userId === userId)) return;
    this.props.shares = this.props.shares.filter(s => s.userId !== userId);
    this.touch();
  }

  /**
   * Records a strategic game on the realm, or its new owner and members (spec 071). It is internal bookkeeping: no
   * realm event and no updatedAt.
   */
  syncGame(game: RealmGame) {
    const entry = { gameId: game.gameId, ownerId: game.ownerId, memberIds: [...new Set(game.memberIds)] };
    const others = this.props.games.filter(g => g.gameId !== game.gameId);
    this.props.games = [...others, entry];
    this.refreshGameReaders();
  }

  /** Forgets a game that was deleted or moved to another realm. */
  removeGame(gameId: string) {
    if (!this.props.games.some(g => g.gameId === gameId)) return;
    this.props.games = this.props.games.filter(g => g.gameId !== gameId);
    this.refreshGameReaders();
  }

  /** The members of the games whose owner reads the realm by themselves (not through another game). */
  private refreshGameReaders() {
    const readers = new Set<string>();
    for (const game of this.props.games) {
      if (resolveOwnAccess(this.props, game.ownerId, []) === 'none') continue;
      for (const id of game.memberIds) readers.add(id);
    }
    this.props.gameReaderIds = [...readers].sort();
  }

  private touch() {
    this.refreshGameReaders();
    this.props.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
