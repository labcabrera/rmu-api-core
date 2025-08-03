import { injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';

@injectable()
export class ConsoleEventNotificationAdapter implements EventNotificationPort {
  async notify(event: DomainEvent): Promise<void> {
    console.log('🔔 EVENT NOTIFICATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📅 Timestamp: ${event.occurredOn.toISOString()}`);
    console.log(`🏷️  Event Type: ${event.eventType}`);
    console.log(`🆔 Aggregate ID: ${event.aggregateId}`);
    console.log(`📦 Version: ${event.eventVersion}`);
    console.log('📄 Event Data:');
    console.log(JSON.stringify(event.toJSON(), null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  async notifyBatch(events: DomainEvent[]): Promise<void> {
    console.log(`🔔 BATCH EVENT NOTIFICATION (${events.length} events):`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      console.log(`\n📋 Event ${i + 1}/${events.length}:`);
      console.log(`  📅 Timestamp: ${event.occurredOn.toISOString()}`);
      console.log(`  🏷️  Event Type: ${event.eventType}`);
      console.log(`  🆔 Aggregate ID: ${event.aggregateId}`);
      console.log(`  📦 Version: ${event.eventVersion}`);
      console.log('  📄 Event Data:');
      console.log('  ' + JSON.stringify(event.toJSON(), null, 2).replace(/\n/g, '\n  '));
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}
