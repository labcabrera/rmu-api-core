import { injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { EventNotificationService } from '@domain/ports/outbound/event-notification-service';

@injectable()
export class EventNotificationRegistry {
  private services: Map<string, EventNotificationService<any>> = new Map();

  /**
   * Register a notification service for specific event types
   */
  registerService<T extends DomainEvent>(service: EventNotificationService<T>): void {
    const eventTypes = service.getHandledEventTypes();
    
    eventTypes.forEach(eventType => {
      if (this.services.has(eventType)) {
        console.warn(`⚠️ Overriding existing service for event type: ${eventType}`);
      }
      this.services.set(eventType, service);
      console.log(`📝 Registered notification service for event type: ${eventType}`);
    });
  }

  /**
   * Notify a single event using the appropriate service
   */
  async notify(event: DomainEvent): Promise<void> {
    const service = this.services.get(event.eventType);
    
    if (!service) {
      console.warn(`⚠️ No notification service found for event type: ${event.eventType}`);
      return;
    }

    try {
      await service.notify(event);
    } catch (error) {
      console.error(`❌ Failed to notify event ${event.eventType}:`, error);
      throw error;
    }
  }

  /**
   * Notify multiple events, grouping by event type and service
   */
  async notifyBatch(events: DomainEvent[]): Promise<void> {
    // Group events by service
    const eventsByService = new Map<EventNotificationService<any>, DomainEvent[]>();
    
    events.forEach(event => {
      const service = this.services.get(event.eventType);
      if (service) {
        if (!eventsByService.has(service)) {
          eventsByService.set(service, []);
        }
        eventsByService.get(service)!.push(event);
      } else {
        console.warn(`⚠️ No notification service found for event type: ${event.eventType}`);
      }
    });

    // Send events in batches per service
    const notifications = Array.from(eventsByService.entries()).map(
      async ([service, serviceEvents]) => {
        try {
          await service.notifyBatch(serviceEvents);
        } catch (error) {
          console.error(`❌ Failed to notify batch for service:`, error);
          throw error;
        }
      }
    );

    await Promise.all(notifications);
  }

  /**
   * Get all registered services
   */
  getRegisteredServices(): Map<string, EventNotificationService<any>> {
    return new Map(this.services);
  }

  /**
   * Get topic configurations from all registered services
   */
  getAllTopicConfigurations(): Array<{ eventTypes: string[]; config: any }> {
    const configs: Array<{ eventTypes: string[]; config: any }> = [];
    const processedServices = new Set<EventNotificationService<any>>();

    this.services.forEach(service => {
      if (!processedServices.has(service)) {
        processedServices.add(service);
        configs.push({
          eventTypes: service.getHandledEventTypes(),
          config: service.getTopicConfiguration()
        });
      }
    });

    return configs;
  }
}
