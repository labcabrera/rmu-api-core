import { DomainEvent } from '../../../domain/events/domain-event';

export interface EventNotificationPort {
  notify(event: DomainEvent<any>): Promise<void>;
}
