import { Injectable, Logger } from '@nestjs/common';
import { Realm } from '../../domain/aggregates/realm';
import { KafkaProducerService } from '../../../core/infrastructure/messaging/kafka-producer.service';
import { DomainEvent } from 'src/modules/core/domain/events/domain-event';

@Injectable()
export class KafkaRealmProducerService {
  private readonly logger = new Logger(KafkaRealmProducerService.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<Realm>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.realm.${event.eventType}.v1`, event).catch((err) => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
