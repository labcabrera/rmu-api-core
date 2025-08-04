import { injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';

@injectable()
export class RaceCreatedEventNotificationService extends AbstractKafkaEventNotificationService<DomainEvent> {
  
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.created.v1',
      partitionCount: parseInt(process.env.RACE_KAFKA_PARTITION_COUNT || '2'),
      replicationFactor: parseInt(process.env.RACE_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.RACE_KAFKA_RETENTION_MS || '604800000'), // 3 days
      compressionType: (process.env.RACE_KAFKA_COMPRESSION_TYPE as any) || 'snappy'
    };
  }

  getServiceName(): string {
    return 'Race Event Notification Service';
  }
}
