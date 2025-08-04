import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmCreatedEvent } from '@domain/events/realm-created.event';

@injectable()
export class RealmCreatedEventNotificationService extends AbstractKafkaEventNotificationService<RealmCreatedEvent> {
  
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.created.v1',
      partitionCount: parseInt(process.env.REALM_KAFKA_PARTITION_COUNT || '2'),
      replicationFactor: parseInt(process.env.REALM_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.REALM_KAFKA_RETENTION_MS || '604800000'), // 7 days
      compressionType: (process.env.REALM_KAFKA_COMPRESSION_TYPE as any) || 'snappy'
    };
  }

  getServiceName(): string {
    return 'Realm Event Notification Service';
  }
}
