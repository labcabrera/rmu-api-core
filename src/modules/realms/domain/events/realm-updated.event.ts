import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { RealmProps } from '../aggregates/realm';

export class RealmUpdatedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('updated', data);
  }
}
