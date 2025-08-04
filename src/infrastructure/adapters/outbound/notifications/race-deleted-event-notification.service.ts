import { inject, injectable } from 'inversify';
import { TopicConfiguration } from '@domain/ports/outbound/event-notification-service';
import { AbstractKafkaEventNotificationService } from './abstract-kafka-event-notification.service';
import { RaceDeletedEvent } from '@domain/events/race-deleted.event';
import { Configuration } from '@shared/configuration';

@injectable()
export class RaceDeletedEventNotificationService extends AbstractKafkaEventNotificationService<RaceDeletedEvent> {
  constructor(@inject('Configuration') config: Configuration) {
    super(config);
  }

  getTopicConfiguration(): TopicConfiguration {
    return {
      topicName: 'internal.rmu-core.race.deleted.v1',
      partitionCount: this.config.kafkaPartitionCount,
      replicationFactor: this.config.kafkaReplicationFactor,
      retentionMs: this.config.kafkaRetentionMs,
      compressionType: this.config.kafkaCompressionType,
    };
  }

  getServiceName(): string {
    return 'Race Deleted Event Notification Service';
  }
}
