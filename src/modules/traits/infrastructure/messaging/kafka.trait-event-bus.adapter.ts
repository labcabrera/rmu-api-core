import { Injectable, Logger } from '@nestjs/common';
import type { TraitEventBusPort } from '../../application/ports/trait-event-bus.port.js';
import { Trait } from '../../domain/aggregates/trait.js';
import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import { KafkaProducerService } from '../../../shared/infrastructure/messaging/kafka-producer.service.js';

@Injectable()
export class KafkaTraitProducerService implements TraitEventBusPort {
  private readonly logger = new Logger(KafkaTraitProducerService.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Trait>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.trait.${event.eventType}.v1`, event).catch(err => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
