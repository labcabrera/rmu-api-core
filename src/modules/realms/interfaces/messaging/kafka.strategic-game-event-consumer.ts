import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { SyncRealmGameCommand } from '../../application/cqrs/commands/sync-realm-game.command.js';

/** The fields of the strategic game events that core reads (spec 071). */
export interface StrategicGameEventData {
  id: string;
  realmId: string;
  owner: string;
  /** Missing in the events of games from before spec 071: no members. */
  members?: { userId: string }[];
}

/** Records the members of each strategic game on its realm: they read the realm while they play (spec 071). */
@Controller()
export class KafkaStrategicGameEventConsumer {
  private readonly logger = new Logger(KafkaStrategicGameEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern<string>('internal.rmu-strategic.game.created.v1')
  async handleGameCreated(@Payload() event: { data: StrategicGameEventData }, @Ctx() context: KafkaContext) {
    await this.sync(event.data, false, context);
  }

  @EventPattern<string>('internal.rmu-strategic.game.updated.v1')
  async handleGameUpdated(@Payload() event: { data: StrategicGameEventData }, @Ctx() context: KafkaContext) {
    await this.sync(event.data, false, context);
  }

  @EventPattern<string>('internal.rmu-strategic.game.deleted.v1')
  async handleGameDeleted(@Payload() event: { data: StrategicGameEventData }, @Ctx() context: KafkaContext) {
    await this.sync(event.data, true, context);
  }

  private async sync(game: StrategicGameEventData, deleted: boolean, context: KafkaContext) {
    this.logger.log(`Received strategic game ${game.id} event from ${context.getTopic()}`);
    const memberIds = (game.members ?? []).map(member => member.userId);
    try {
      await this.commandBus.execute(new SyncRealmGameCommand(game.id, deleted ? null : game.realmId, game.owner, memberIds));
    } catch (error) {
      this.logger.error(
        `Failed to process ${context.getTopic()} for game ${game.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
