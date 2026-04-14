import { Injectable, Logger } from '@nestjs/common';
import { RealmEventBusPort } from '../../application/ports/realm-event-bus.port';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { KafkaProducerService } from 'src/modules/shared/infrastructure/messaging/kafka-producer.service';
import { RealmProps } from '../../domain/aggregates/realm-props';

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
