import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmCreatedEvent } from '@domain/events/realm-created.event';
import { Configuration } from '@shared/configuration';

@injectable()
export class RealmCreatedEventNotificationService extends AbstractKafkaEventNotificationService<RealmCreatedEvent> {
  constructor(@inject('Configuration') config: Configuration) {
    super(config);
  }
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.created.v1',
      partitionCount: this.config.kafkaPartitionCount,
      replicationFactor: this.config.kafkaReplicationFactor,
      retentionMs: this.config.kafkaRetentionMs,
      compressionType: this.config.kafkaCompressionType,
    };
  }

  getServiceName(): string {
    return 'Realm Created Event Notification Service';
  }
}
