import { Injectable, Logger } from '@nestjs/common';
import type { RealmEventBusPort } from '../../application/ports/realm-event-bus.port.js';
import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import { KafkaProducerService } from '../../../shared/infrastructure/messaging/kafka-producer.service.js';
import type { RealmProps } from '../../domain/aggregates/realm-props.js';

@Injectable()
export class KafkaRealmProducerService implements RealmEventBusPort {
  private readonly logger = new Logger(KafkaRealmProducerService.name);

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  publish(event: DomainEvent<RealmProps>): void {
    this.kafkaProducerService.emit(`internal.rmu-core.realm.${event.eventType}.v1`, event).catch(err => {
      //TODO handle error properly
      this.logger.error('Error publishing event to Kafka', err);
    });
  }
}
