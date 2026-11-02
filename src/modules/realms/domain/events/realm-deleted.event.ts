import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RealmProps } from '../aggregates/realm-props.js';

export class RealmDeletedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('deleted', data);
  }
}
