import { injectable } from 'inversify';
import { DomainEvent } from '@domain/events/domain-event';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';

@injectable()
export class RealmEventNotificationService extends AbstractKafkaEventNotificationService<DomainEvent> {
  
  getHandledEventTypes(): string[] {
    return ['RealmCreatedEvent', 'RealmUpdatedEvent', 'RealmDeletedEvent'];
  }

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'rmu-core.realm-events',
      partitionCount: parseInt(process.env.REALM_KAFKA_PARTITION_COUNT || '3'),
      replicationFactor: parseInt(process.env.REALM_KAFKA_REPLICATION_FACTOR || '1'),
      retentionMs: parseInt(process.env.REALM_KAFKA_RETENTION_MS || '604800000'), // 7 days
      compressionType: (process.env.REALM_KAFKA_COMPRESSION_TYPE as any) || 'gzip'
    };
  }

  getServiceName(): string {
    return 'Realm Event Notification Service';
  }
}
