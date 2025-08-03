import { inject, injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';

@injectable()
export class EventNotificationService {
  constructor(
    @inject('EventNotificationPort') private eventNotificationPort: EventNotificationPort
  ) {}

  async publishEvent(event: DomainEvent): Promise<void> {
    try {
      console.log(`📡 Publishing event: ${event.eventType} for aggregate ${event.aggregateId}`);
      await this.eventNotificationPort.notify(event);
      console.log(`✅ Event published successfully: ${event.eventType}`);
    } catch (error) {
      console.error(`❌ Failed to publish event ${event.eventType}:`, error);
      // En un sistema real, podrías querer implementar retry logic o dead letter queue
      throw error;
    }
  }

  async publishEvents(events: DomainEvent[]): Promise<void> {
    try {
      console.log(`📡 Publishing ${events.length} events`);
      await this.eventNotificationPort.notifyBatch(events);
      console.log(`✅ All ${events.length} events published successfully`);
    } catch (error) {
      console.error(`❌ Failed to publish batch of ${events.length} events:`, error);
      throw error;
    }
  }
}
