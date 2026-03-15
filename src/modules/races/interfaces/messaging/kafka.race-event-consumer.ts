import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { UpdateRaceRealmNameCommand } from '../../application/cqrs/commands/update-race-realm.command';
import { DomainEvent } from 'src/modules/shared/domain/events/domain-event';
import { RealmProps } from 'src/modules/realms/domain/aggregates/realm-props';
import { DeleteRacesByRealmCommand } from '../../application/cqrs/commands/delete-races-by-realm.command';

@Controller()
export class KafkaRaceEventConsumer {
  private readonly logger = new Logger(KafkaRaceEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('internal.rmu-core.realm.updated.v1')
  async handleRealmUpdated(@Payload() event: DomainEvent<RealmProps>, @Ctx() context: KafkaContext) {
    this.logger.log(`Received realm ${event.data.id} updated event from ${context.getTopic()}`);
    const realm = event.data;
    const command = new UpdateRaceRealmNameCommand(realm.id, realm.name, realm.owner, realm.accessType);
    await this.commandBus.execute(command);
  }

  @EventPattern('internal.rmu-core.realm.deleted.v1')
  async handleRealmDeleted(@Payload() event: DomainEvent<RealmProps>, @Ctx() context: KafkaContext) {
    this.logger.log(`Received realm ${event.data.id} deleted event from ${context.getTopic()}`);
    const command = new DeleteRacesByRealmCommand(event.data.id);
    await this.commandBus.execute(command);
  }
}
