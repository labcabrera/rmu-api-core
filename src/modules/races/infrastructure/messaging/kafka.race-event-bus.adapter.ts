import { Injectable, Logger } from '@nestjs/common';
import { Race } from '../../domain/aggregates/race';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { KafkaProducerService } from 'src/modules/shared/infrastructure/messaging/kafka-producer.service';

@Injectable()
export class KafkaRaceEventBusAdapter {
  private readonly logger = new Logger(KafkaRaceEventBusAdapter.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Race>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.race.${event.eventType}.v1`, event).catch(err => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
