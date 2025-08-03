import { DomainEvent } from '../../events/domain-event';

/**
 * Port for notifying domain events using a registry-based approach
 * This allows different services to handle different types of events
 */
export interface EventNotificationPort {
  /**
   * Notify a single event
   * The registry will route to the appropriate service
   */
  notify(event: DomainEvent): Promise<void>;

  /**
   * Notify multiple events
   * Events will be grouped by service for efficient processing
   */
  notifyBatch(events: DomainEvent[]): Promise<void>;
}
