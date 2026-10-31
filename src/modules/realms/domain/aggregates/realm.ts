import { RealmCreatedEvent } from '../events/realm-created.event.js';
import { RealmUpdatedEvent } from '../events/realm-updated.event.js';
import { randomUUID } from 'crypto';
import type { RealmProps } from './realm-props.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';

type Clearable<T> = { [K in keyof T]?: T[K] | null };

export type RealmUpdate = Partial<Pick<RealmProps, 'name' | 'magicPresence' | 'accessType' | 'generic'>> &
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

  get accessType() {
    return this.props.accessType;
  }

  get generic() {
    return this.props.generic;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  static create(props: Omit<RealmProps, 'id' | 'createdAt' | 'updatedAt'>) {
    const realm = new Realm({ ...props, id: randomUUID(), createdAt: new Date(), updatedAt: undefined });
    realm.apply(new RealmCreatedEvent(realm.getProps()));
    return realm;
  }

  static fromProps(props: RealmProps) {
    return new Realm({ ...props });
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
    // A change without effect keeps the stored updatedAt: the handler neither writes nor publishes it.
    if (this.hasChanges()) this.props.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
