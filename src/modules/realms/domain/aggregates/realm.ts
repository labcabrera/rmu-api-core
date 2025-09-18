import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RealmCreatedEvent } from '../events/realm-created.event';
import { RealmUpdatedEvent } from '../events/realm-updated.event';

export class Realm extends AggregateRoot<DomainEvent<Realm>> {
  constructor(
    public id: string,
    public name: string,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(id: string, name: string, description: string | undefined, userId: string) {
    const realm = new Realm(id, name, description, userId, new Date(), undefined);
    realm.apply(new RealmCreatedEvent(realm));
    return realm;
  }

  update(name: string | undefined, description: string | undefined) {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new RealmUpdatedEvent(this));
  }
}
