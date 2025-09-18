import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducerService } from '../../../core/infrastructure/messaging/kafka-producer.service';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';
import { Race } from '../../domain/aggregates/race';

@Injectable()
export class KafkaRaceEventBusAdapter {
  private readonly logger = new Logger(KafkaRaceEventBusAdapter.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Race>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.race.${event.eventType}.v1`, event).catch((err) => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
