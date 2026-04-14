import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { KafkaProducerService } from 'src/modules/shared/infrastructure/messaging/kafka-producer.service';
import { CultureProps } from '../../domain/aggregates/culture-props';

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
