import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import { KafkaProducerService } from '../../../shared/infrastructure/messaging/kafka-producer.service.js';
import type { CultureProps } from '../../domain/aggregates/culture-props.js';

@Injectable()
export class KafkaCultureEventBusAdapter {
  private readonly logger = new Logger(KafkaCultureEventBusAdapter.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<CultureProps>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.culture.${event.eventType}.v1`, event).catch(err => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
