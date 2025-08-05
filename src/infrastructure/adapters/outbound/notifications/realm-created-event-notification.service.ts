import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmCreatedEvent } from '@domain/events/realm-created.event';
import { config } from '@infrastructure/config/config';

@injectable()
export class RealmCreatedEventNotificationService extends AbstractKafkaEventNotificationService<RealmCreatedEvent> {

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.created.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Realm Created Event Notification Service';
  }
}
