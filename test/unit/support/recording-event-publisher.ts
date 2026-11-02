import type { DomainEventPublisher } from '../../../src/modules/shared/application/ports/domain-event-publisher.port.js';
import type { BaseAggregateRoot } from '../../../src/modules/shared/domain/aggregates/base-aggregate.js';
import type { DomainEvent } from '../../../src/modules/shared/domain/events/domain-event.js';

/** DomainEventPublisher double that records what the handlers publish. */
export class RecordingEventPublisher implements DomainEventPublisher {
  readonly published: { topic: string; event: DomainEvent<unknown> }[] = [];

  publish(aggregateType: string, ...events: DomainEvent<unknown>[]): Promise<void> {
    events.forEach(event => this.published.push({ topic: `${aggregateType}.${event.eventType}`, event }));
    return Promise.resolve();
  }

  publishChanges(aggregateType: string, aggregate: BaseAggregateRoot<{ id: string }>): Promise<void> {
    const events = [...aggregate.getUncommittedEvents()];
    aggregate.uncommit();
    return this.publish(aggregateType, ...events);
  }

  /** `<aggregate>.<eventType>` of every published event, in order. */
  get topics(): string[] {
    return this.published.map(p => p.topic);
  }
}
