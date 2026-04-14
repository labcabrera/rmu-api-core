import { Injectable, Logger } from '@nestjs/common';
import { TraitEventBusPort } from '../../application/ports/trait-event-bus.port';
import { Trait } from '../../domain/aggregates/trait';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { KafkaProducerService } from 'src/modules/shared/infrastructure/messaging/kafka-producer.service';

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
