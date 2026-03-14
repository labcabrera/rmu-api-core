import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { UpdateRaceRealmNameCommand } from '../../application/cqrs/commands/update-race-realm-name.command';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { RealmProps } from 'src/modules/realms/domain/aggregates/realm-props';

@Controller()
export class KafkaRaceRealmEventConsumer {
  private readonly logger = new Logger(KafkaRaceRealmEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('internal.rmu-core.realm.updated.v1')
  async handleRealmDeleted(@Payload() event: DomainEvent<RealmProps>, @Ctx() context: KafkaContext) {
    this.logger.log(`Received event on topic ${context.getTopic()}: ${JSON.stringify(event)}`);
    const command = new UpdateRaceRealmNameCommand(event.data.id, event.data.name);
    await this.commandBus.execute(command);
  }
}
