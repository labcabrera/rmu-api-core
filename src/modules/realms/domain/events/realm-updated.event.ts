import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RealmProps } from '../aggregates/realm-props.js';

export class RealmUpdatedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('updated', data);
  }
}
