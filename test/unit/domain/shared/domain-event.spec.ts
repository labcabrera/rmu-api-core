import { afterEach, describe, expect, it, vi } from 'vitest';
import { DomainEvent } from '../../../../src/modules/shared/domain/events/domain-event.js';

describe('DomainEvent', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('names the API that produced it by its Kafka client id (spec 021, decision 10)', () => {
    vi.stubEnv('RMU_KAFKA_CLIENT_ID', 'rmu-api-core-test');

    expect(new DomainEvent('created', { id: 'realm-1' }).producer).toBe('rmu-api-core-test');
  });

  it('builds a versioned event with the API name as producer when there is no client id, timestamp and payload', () => {
    vi.stubEnv('RMU_KAFKA_CLIENT_ID', '');
    const payload = { id: 'realm-1', name: 'Shadow World' };

    const event = new DomainEvent('created', payload);

    expect(event.eventType).toBe('created');
    expect(event.eventVersion).toBe('1');
    expect(event.producer).toBe('rmu-api-core');
    expect(event.data).toBe(payload);
    expect(event.eventTime).toBeInstanceOf(Date);
  });
});
