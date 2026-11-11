import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { RevokeSharesBetweenUsersCommand } from '../../application/cqrs/commands/revoke-shares-between-users.command.js';

/** The fields of the friendship events of users that core reads (spec 069, plan "Amistades"). */
export interface FriendshipEventData {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
}

/**
 * Removes the shares between two users when their friendship ends (spec 069, decision 7): blocked in an update, or
 * deleted. Other updates (accepting, rejecting a request) change nothing.
 */
@Controller()
export class KafkaFriendshipEventConsumer {
  private readonly logger = new Logger(KafkaFriendshipEventConsumer.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern<string>('internal.rmu-users.friendship.updated.v1')
  async handleFriendshipUpdated(@Payload() event: { data: FriendshipEventData }, @Ctx() context: KafkaContext) {
    if (event.data.status !== 'blocked') return;
    await this.revoke(event.data, context);
  }

  @EventPattern<string>('internal.rmu-users.friendship.deleted.v1')
  async handleFriendshipDeleted(@Payload() event: { data: FriendshipEventData }, @Ctx() context: KafkaContext) {
    await this.revoke(event.data, context);
  }

  private async revoke(friendship: FriendshipEventData, context: KafkaContext) {
    this.logger.log(`Received friendship ${friendship.id} event from ${context.getTopic()}`);
    try {
      await this.commandBus.execute(new RevokeSharesBetweenUsersCommand(friendship.requesterId, friendship.addresseeId));
    } catch (error) {
      this.logger.error(
        `Failed to process ${context.getTopic()} for friendship ${friendship.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }
}
