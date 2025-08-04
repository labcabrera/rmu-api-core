import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceDeletedEvent } from '@domain/events/race-deleted.event';

@injectable()
export class RaceDeletedEventNotificationService extends AbstractKafkaEventNotificationService<RaceDeletedEvent> {
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.deleted.v1',
      partitionCount: parseInt(process.env.RACE_KAFKA_PARTITION_COUNT || '2'),
      replicationFactor: parseInt(process.env.RACE_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.RACE_KAFKA_RETENTION_MS || '604800000'),
      compressionType: (process.env.RACE_KAFKA_COMPRESSION_TYPE as any) || 'snappy',
    };
  }

  getServiceName(): string {
    return 'Race Deleted Event Notification Service';
  }
}
