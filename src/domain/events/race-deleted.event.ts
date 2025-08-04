import { DomainEvent } from './domain-event';
import { Race } from '@domain/entities/race';

export class RaceDeletedEvent implements DomainEvent {
  public readonly eventType = 'RaceDeletedEvent';
  public readonly eventVersion = 1;
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly race: Race,
    public readonly createdBy: string
  ) {
    this.occurredOn = new Date();
  }

  toJSON(): object {
    return {
      raceId: this.aggregateId,
      raceName: this.race.name,
      realmId: this.race.realm,
      size: this.race.size,
      defaultStatBonus: this.race.defaultStatBonus,
      resistances: this.race.resistances,
      description: this.race.description
    };
  }
}
