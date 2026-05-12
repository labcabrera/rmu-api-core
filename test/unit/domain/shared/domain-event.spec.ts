import { describe, expect, it } from '@jest/globals';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

describe('DomainEvent', () => {
  it('builds a versioned event with producer, timestamp and payload', () => {
    const payload = { id: 'realm-1', name: 'Shadow World' };

    const event = new DomainEvent('created', payload);

    expect(event.eventType).toBe('created');
    expect(event.eventVersion).toBe('1');
    expect(event.producer).toBe('rmu-api-core');
    expect(event.data).toBe(payload);
    expect(event.eventTime).toBeInstanceOf(Date);
  });
});
