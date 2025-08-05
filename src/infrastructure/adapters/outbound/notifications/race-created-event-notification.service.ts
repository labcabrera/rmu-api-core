import { injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceCreatedEvent } from '@domain/events/race-created.event';
import { config } from '@infrastructure/config/config';
import { Race } from '@domain/entities/race';

@injectable()
export class RaceCreatedEventNotificationService extends AbstractKafkaEventNotificationService<
  RaceCreatedEvent,
  Race
> {
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.created.v1',
      partitionCount: config.kafka.partitionCount,
      replicationFactor: config.kafka.replicationFactor,
      retentionMs: config.kafka.retentionMs,
      compressionType: config.kafka.compressionType,
    };
  }

  getServiceName(): string {
    return 'Race Created Event Notification Service';
  }
}
