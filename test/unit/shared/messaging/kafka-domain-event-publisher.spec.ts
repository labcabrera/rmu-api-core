import { describe, expect, it, vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { KafkaDomainEventPublisher } from '../../../../src/modules/shared/infrastructure/messaging/kafka-domain-event-publisher.js';
import type { KafkaProducerService } from '../../../../src/modules/shared/infrastructure/messaging/kafka-producer.service.js';
import { BaseAggregateRoot } from '../../../../src/modules/shared/domain/aggregates/base-aggregate.js';
import { DomainEvent } from '../../../../src/modules/shared/domain/events/domain-event.js';

class Thing extends BaseAggregateRoot<{ id: string }> {
  touch(eventType: string) {
    this.apply(new DomainEvent(eventType, this.getProps()));
  }

  getProps() {
    return { id: this.id };
  }
}

const setup = (emit = vi.fn(() => Promise.resolve())) => {
  const publisher = new KafkaDomainEventPublisher({ emit } as unknown as KafkaProducerService);
  return { publisher, emit };
};

describe('KafkaDomainEventPublisher', () => {
  it('sends each event to its versioned topic, in order', async () => {
    const { publisher, emit } = setup();
    const created = new DomainEvent('created', { id: 'race-1' });
    const updated = new DomainEvent('updated', { id: 'race-1' });

    await publisher.publish('race', created, updated);

    expect(emit.mock.calls).toEqual([
      ['internal.rmu-core.race.created.v1', created],
      ['internal.rmu-core.race.updated.v1', updated],
    ]);
  });

  it('publishes the uncommitted events of an aggregate and clears them', async () => {
    const { publisher, emit } = setup();
    const thing = new Thing('thing-1');
    thing.touch('created');
    thing.touch('updated');

    await publisher.publishChanges('thing', thing);

    expect(emit.mock.calls.map(([topic]) => topic)).toEqual(['internal.rmu-core.thing.created.v1', 'internal.rmu-core.thing.updated.v1']);
    expect(thing.getUncommittedEvents()).toEqual([]);
  });

  it('logs a failed send instead of throwing and keeps publishing the rest', async () => {
    const emit = vi.fn().mockRejectedValueOnce(new Error('broker down')).mockResolvedValue(undefined);
    const { publisher } = setup(emit);
    const error = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    await expect(
      publisher.publish('realm', new DomainEvent('deleted', { id: 'realm-1' }), new DomainEvent('deleted', { id: 'realm-2' })),
    ).resolves.toBeUndefined();

    expect(emit).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledWith('Lost internal.rmu-core.realm.deleted.v1 for realm realm-1: broker down');
    error.mockRestore();
  });
});
