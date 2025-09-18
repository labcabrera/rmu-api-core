import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RealmProps } from '../aggregates/realm';

export class RealmCreatedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('created', data);
  }
}
