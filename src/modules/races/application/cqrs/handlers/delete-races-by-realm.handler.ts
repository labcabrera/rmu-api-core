import { Inject, Logger } from '@nestjs/common';
import { DeleteRaceCommand } from '../commands/delete-race.command';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import { DeleteRacesByRealmCommand } from '../commands/delete-races-by-realm.command';

@CommandHandler(DeleteRacesByRealmCommand)
export class DeleteRacesByRealmHandler implements ICommandHandler<DeleteRacesByRealmCommand> {
  private readonly logger = new Logger(DeleteRacesByRealmHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: DeleteRacesByRealmCommand): Promise<void> {
    this.logger.log(`Deleting races for realm ${command.realmId}`);
    const races = await this.raceRepository.findByRealmId(command.realmId);
    //TODO async delete
    for (const race of races) {
      const deleteCmd = new DeleteRaceCommand(race.id, 'system', ['rmu-admin']);
      await this.commandBus.execute(deleteCmd);
    }
  }
}
