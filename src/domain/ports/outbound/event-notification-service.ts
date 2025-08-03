import { DomainEvent } from '@domain/events/domain-event';

/**
 * Interface for event-specific notification services
 */
export interface EventNotificationService<T extends DomainEvent> {
  /**
   * Notify a single event
   */
  notify(event: T): Promise<void>;

  /**
   * Notify multiple events of the same type
   */
  notifyBatch(events: T[]): Promise<void>;

  /**
   * Get the event types this service handles
   */
  getHandledEventTypes(): string[];

  /**
   * Get the topic configuration for events handled by this service
   */
  getTopicConfiguration(): TopicConfiguration;
}

export interface TopicConfiguration {
  topicName: string;
  partitionCount: number;
  replicationFactor?: number;
  retentionMs?: number;
  compressionType?: 'gzip' | 'snappy' | 'lz4' | 'zstd';
}
