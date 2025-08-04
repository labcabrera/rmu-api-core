import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmDeletedEvent as RealmUpdatedEvent } from '@domain/events/realm-deleted.event';
import { Configuration } from '@shared/configuration';

@injectable()
export class RealmUpdatedEventNotificationService extends AbstractKafkaEventNotificationService<RealmUpdatedEvent> {
  constructor(@inject('Configuration') config: Configuration) {
    super(config);
  }

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.updated.v1',
      partitionCount: this.config.kafkaPartitionCount,
      replicationFactor: this.config.kafkaReplicationFactor,
      retentionMs: this.config.kafkaRetentionMs,
      compressionType: this.config.kafkaCompressionType,
    };
  }

  getServiceName(): string {
    return 'Realm Updated Event Notification Service';
  }
}
