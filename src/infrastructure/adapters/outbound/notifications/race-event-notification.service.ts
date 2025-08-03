import { injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';

@injectable()
export class RaceEventNotificationService extends AbstractKafkaEventNotificationService<DomainEvent> {
  
  getHandledEventTypes(): string[] {
    return ['RaceCreatedEvent', 'RaceUpdatedEvent', 'RaceDeletedEvent'];
  }

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'rmu-core.race-events',
      partitionCount: parseInt(process.env.RACE_KAFKA_PARTITION_COUNT || '2'),
      replicationFactor: parseInt(process.env.RACE_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.RACE_KAFKA_RETENTION_MS || '259200000'), // 3 days
      compressionType: (process.env.RACE_KAFKA_COMPRESSION_TYPE as any) || 'snappy'
    };
  }

  getServiceName(): string {
    return 'Race Event Notification Service';
  }
}
