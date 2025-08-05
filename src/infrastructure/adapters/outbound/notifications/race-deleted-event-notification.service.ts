import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceDeletedEvent } from '@domain/events/race-deleted.event';
import { config } from '@infrastructure/config/config';
@injectable()
export class RaceDeletedEventNotificationService extends AbstractKafkaEventNotificationService<RaceDeletedEvent> {
  
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.deleted.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Race Deleted Event Notification Service';
  }
}
