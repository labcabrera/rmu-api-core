import { injectable } from 'inversify';
import { TopicConfiguration } from '@application/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceUpdatedEvent } from '@domain/events/race-updated.event';
import { config } from '@infrastructure/config/config';
import { Race } from '@domain/entities/race';

@injectable()
export class RaceUpdatedEventNotificationService extends AbstractKafkaEventNotificationService<
  RaceUpdatedEvent,
  Race
> {
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
