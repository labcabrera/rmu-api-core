import { Injectable, Logger } from '@nestjs/common';
import { Language } from '../../domain/aggregates/language';
import { LanguageEventBusPort } from '../../application/ports/language-event-bus.port';
import { KafkaProducerService } from 'src/modules/shared/infrastructure/messaging/kafka-producer.service';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';

@Injectable()
export class KafkaLanguageProducerService implements LanguageEventBusPort {
  private readonly logger = new Logger(KafkaLanguageProducerService.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Language>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.language.${event.eventType}.v1`, event).catch((err) => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
