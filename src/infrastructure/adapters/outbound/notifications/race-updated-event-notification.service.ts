import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceUpdatedEvent } from '@domain/events/race-updated.event';
import { config } from '@infrastructure/config/config';

@injectable()
export class RaceUpdatedEventNotificationService extends AbstractKafkaEventNotificationService<RaceUpdatedEvent> {

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.updated.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Race Updated Event Notification Service';
  }
}
