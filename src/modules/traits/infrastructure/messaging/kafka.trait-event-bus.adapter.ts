import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducerService } from '../../../core/infrastructure/messaging/kafka-producer.service';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { TraitEventBusPort } from '../../application/ports/trait-event-bus.port';
import { Trait } from '../../domain/aggregates/trait';

@Injectable()
export class KafkaTraitProducerService implements TraitEventBusPort {
  private readonly logger = new Logger(KafkaTraitProducerService.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Trait>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.trait.${event.eventType}.v1`, event).catch((err) => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
