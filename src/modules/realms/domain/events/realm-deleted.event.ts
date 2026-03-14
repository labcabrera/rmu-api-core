import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { RealmProps } from '../aggregates/realm-props';

export class RealmDeletedEvent extends DomainEvent<RealmProps> {
  constructor(data: RealmProps) {
    super('deleted', data);
  }
}
