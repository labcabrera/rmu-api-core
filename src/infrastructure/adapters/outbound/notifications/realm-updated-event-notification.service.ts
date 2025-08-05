import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmDeletedEvent as RealmUpdatedEvent } from '@domain/events/realm-deleted.event';
import { config } from '@infrastructure/config/config';
import { Realm } from '@domain/entities/realm';

@injectable()
export class RealmUpdatedEventNotificationService extends AbstractKafkaEventNotificationService<
  RealmUpdatedEvent,
  Realm
> {
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.updated.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Realm Updated Event Notification Service';
  }
}
