import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceCreatedEvent } from '@domain/events/race-created.event';
import { Configuration } from '@shared/configuration';

@injectable()
export class RaceCreatedEventNotificationService extends AbstractKafkaEventNotificationService<RaceCreatedEvent> {
  constructor(@inject('Configuration') config: Configuration) {
    super(config);
  }

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.created.v1',
      partitionCount: this.config.kafkaPartitionCount,
      replicationFactor: this.config.kafkaReplicationFactor,
      retentionMs: this.config.kafkaRetentionMs,
      compressionType: this.config.kafkaCompressionType,
    };
  }

  getServiceName(): string {
    return 'Race Created Event Notification Service';
  }
}
