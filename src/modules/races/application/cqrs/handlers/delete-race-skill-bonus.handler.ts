import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';
import { DeleteRaceSkillBonusCommand } from '../commands/delete-race-skill-bonus.command.js';

@CommandHandler(DeleteRaceSkillBonusCommand)
export class DeleteRaceSkillBonusHandler implements ICommandHandler<DeleteRaceSkillBonusCommand, Race> {
  private readonly logger = new Logger(DeleteRaceSkillBonusHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: DeleteRaceSkillBonusCommand): Promise<Race> {
    this.logger.log(`Deleting skill bonus ${command.skillId} from race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.removeSkillBonus(command.skillId, command.specialization);

    const updated = await this.raceRepository.update(command.raceId, race);
    race.getUncommittedEvents().forEach(event => this.raceEventBus.publish(event));
    return updated;
  }
}
