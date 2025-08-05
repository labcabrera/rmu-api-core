import { injectable } from 'inversify';
import { TopicConfiguration } from '@application/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RealmDeletedEvent } from '@domain/events/realm-deleted.event';
import { config } from '@infrastructure/config/config';
import { Realm } from '@domain/entities/realm';

@injectable()
export class RealmDeletedEventNotificationService extends AbstractKafkaEventNotificationService<
  RealmDeletedEvent,
  Realm
> {
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.realm.deleted.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Realm Deleted Event Notification Service';
  }
}
