import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { randomUUID } from 'crypto';
import { TraitCreatedEvent } from '../events/trait-created.event';
import { TraitUpdatedEvent } from '../events/trait-updated.event';

export class Trait extends AggregateRoot<DomainEvent<Trait>> {
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
  static create(name: string, description: string | undefined, userId: string) {
    const realm = new Trait(randomUUID(), name, description, userId, new Date(), undefined);
    realm.apply(new TraitCreatedEvent(realm));
    return realm;
  }

  update(name: string | undefined, description: string | undefined) {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this));
  }
}
