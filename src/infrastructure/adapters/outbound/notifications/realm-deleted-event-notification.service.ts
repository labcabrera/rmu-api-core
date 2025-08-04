import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmDeletedEvent } from '@domain/events/realm-deleted.event';

@injectable()
export class RealmDeletedEventNotificationService extends AbstractKafkaEventNotificationService<RealmDeletedEvent> {
  
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.deleted.v1',
      partitionCount: parseInt(process.env.REALM_KAFKA_PARTITION_COUNT || '2'),
      replicationFactor: parseInt(process.env.REALM_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.REALM_KAFKA_RETENTION_MS || '604800000'),
      compressionType: (process.env.REALM_KAFKA_COMPRESSION_TYPE as any) || 'snappy'
    };
  }

  getServiceName(): string {
    return 'Realm Event Notification Service';
  }
}
