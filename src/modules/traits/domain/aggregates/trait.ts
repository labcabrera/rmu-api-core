import { AggregateRoot } from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitCreatedEvent } from '../events/trait-created.event';
import { TraitUpdatedEvent } from '../events/trait-updated.event';

export class Trait extends AggregateRoot<DomainEvent<Trait>> {
  constructor(
    public id: string,
    public cost: number | undefined,
    public description: string | undefined,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
  ) {
    super();
  }
  static create(id: string, cost: number | undefined, description: string | undefined, userId: string) {
    const realm = new Trait(id, cost, description, userId, new Date(), undefined);
    realm.apply(new TraitCreatedEvent(realm));
    return realm;
  }

  update(cost: number | undefined, description: string | undefined) {
    if (cost !== undefined) this.cost = cost;
    if (description) this.description = description;
    this.updatedAt = new Date();
    this.apply(new TraitUpdatedEvent(this));
  }
}
