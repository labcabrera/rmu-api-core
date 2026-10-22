import { RealmCreatedEvent } from '../events/realm-created.event.js';
import { RealmUpdatedEvent } from '../events/realm-updated.event.js';
import { randomUUID } from 'crypto';
import type { RealmProps } from './realm-props.js';
import { BaseAggregateRoot } from '../../../shared/domain/aggregates/base-aggregate.js';

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

  update(props: Partial<Omit<RealmProps, 'id' | 'owner' | 'createdAt' | 'updatedAt'>>) {
    if (props.name) this.props.name = props.name;
    if (props.magicPresence) this.props.magicPresence = props.magicPresence;
    if (props.shortDescription) this.props.shortDescription = props.shortDescription;
    if (props.description) this.props.description = props.description;
    if (props.imageUrl !== undefined) this.props.imageUrl = props.imageUrl;
    if (props.accessType !== undefined) this.props.accessType = props.accessType;
    this.props.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this.getProps()));
  }
}
