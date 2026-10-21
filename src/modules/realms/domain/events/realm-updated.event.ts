import { DomainEvent } from '../../../shared/domain/events/domain-event';
import { RealmProps } from '../aggregates/realm-props';

export class RealmUpdatedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('updated', data);
  }
}
