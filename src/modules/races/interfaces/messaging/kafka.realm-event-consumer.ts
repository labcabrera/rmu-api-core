import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { SyncRaceRealmCommand } from '../../application/cqrs/commands/sync-race-realm.command.js';
import { DeleteRacesByRealmCommand } from '../../application/cqrs/commands/delete-races-by-realm.command.js';
import { DomainEvent } from '../../../shared/domain/events/domain-event.js';
import type { RealmProps } from '../../../realms/domain/aggregates/realm-props.js';

/** Keeps the races in step with their realm. It only depends on the realm topics and their payload. */
@Controller()
export class KafkaRealmEventConsumer {
  private readonly logger = new Logger(KafkaRealmEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern<string>('internal.rmu-core.realm.updated.v1')
  async handleRealmUpdated(@Payload() event: DomainEvent<RealmProps>, @Ctx() context: KafkaContext) {
    const realm = event.data;
    await this.run(context, realm.id, new SyncRaceRealmCommand(realm.id, realm.name, realm.owner, realm.accessType));
  }

  @EventPattern<string>('internal.rmu-core.realm.deleted.v1')
  async handleRealmDeleted(@Payload() event: DomainEvent<RealmProps>, @Ctx() context: KafkaContext) {
    await this.run(context, event.data.id, new DeleteRacesByRealmCommand(event.data.id));
  }

  private async run(context: KafkaContext, realmId: string, command: object) {
    this.logger.log(`Received realm ${realmId} event from ${context.getTopic()}`);
    try {
      await this.commandBus.execute(command);
    } catch (error) {
      this.logger.error(
        `Failed to process ${context.getTopic()} for realm ${realmId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
