import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { RACE_GUARD, type RaceGuardPort } from '../../ports/race-guard.port.js';
import { DeleteRaceSkillBonusCommand } from '../commands/delete-race-skill-bonus.command.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(DeleteRaceSkillBonusCommand)
export class DeleteRaceSkillBonusHandler implements ICommandHandler<DeleteRaceSkillBonusCommand, Race> {
  private readonly logger = new Logger(DeleteRaceSkillBonusHandler.name);

  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(RACE_GUARD) private readonly raceGuard: RaceGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: DeleteRaceSkillBonusCommand): Promise<Race> {
    this.logger.log(`Deleting skill bonus ${command.skillId} from race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.removeSkillBonus(command.skillId, command.specialization);

    // A change that leaves the state as it was neither writes nor publishes (spec 021, decision 9).
    if (!race.hasChanges()) return race;
    const updated = await this.raceRepository.update(race);
    await this.events.publishChanges('race', race);
    return updated;
  }
}
