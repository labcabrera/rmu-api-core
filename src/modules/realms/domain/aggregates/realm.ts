import { RealmCreatedEvent } from '../events/realm-created.event.js';
import { RealmUpdatedEvent } from '../events/realm-updated.event.js';
import { randomUUID } from 'crypto';
import type { RealmProps } from './realm-props.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';
import { type EntityShare, MAX_SHARES, type ShareLevel } from '../../../shared/domain/entities/entity-share.js';
import { ValidationError } from '../../../shared/domain/errors/errors.js';

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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt' | 'shares'>) {
    const realm = new Realm({ ...props, shares: [], id: randomUUID(), createdAt: new Date(), updatedAt: undefined });
    realm.apply(new RealmCreatedEvent(realm.getProps()));
    return realm;
  }

  static fromProps(props: RealmProps) {
    return new Realm({ ...props, shares: [...(props.shares ?? [])] });
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

  private touch() {
    this.props.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
