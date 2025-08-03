import { injectable, inject } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { EventNotificationRegistry } from './event-notification-registry';

@injectable()
export class RegistryEventNotificationAdapter implements EventNotificationPort {
  
  constructor(
    @inject('EventNotificationRegistry') private registry: EventNotificationRegistry
  ) {
    console.log('🚀 Registry Event Notification Adapter initialized');
  }

  async notify(event: DomainEvent): Promise<void> {
    await this.registry.notify(event);
  }

  async notifyBatch(events: DomainEvent[]): Promise<void> {
    await this.registry.notifyBatch(events);
  }
}
