import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceUpdatedEvent } from '@domain/events/race-updated.event';
import { Configuration } from '@shared/configuration';

@injectable()
export class RaceUpdatedEventNotificationService extends AbstractKafkaEventNotificationService<RaceUpdatedEvent> {
  constructor(@inject('Configuration') config: Configuration) {
    super(config);
  }
  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.updated.v1',
      partitionCount: this.config.kafkaPartitionCount,
      replicationFactor: this.config.kafkaReplicationFactor,
      retentionMs: this.config.kafkaRetentionMs,
      compressionType: this.config.kafkaCompressionType,
    };
  }

  getServiceName(): string {
    return 'Race Updated Event Notification Service';
  }
}
