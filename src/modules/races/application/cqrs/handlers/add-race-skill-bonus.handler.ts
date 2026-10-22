import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import type { RaceGuardPort } from '../../ports/race-guard.port.js';
import { AddRaceSkillBonusCommand } from '../commands/add-race-skill-bonus.command.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(AddRaceSkillBonusCommand)
export class AddRaceSkillBonusHandler implements ICommandHandler<AddRaceSkillBonusCommand, Race> {
  private readonly logger = new Logger(AddRaceSkillBonusHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RaceGuardPort') private readonly raceGuard: RaceGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: AddRaceSkillBonusCommand): Promise<Race> {
    this.logger.log(`Adding skill bonus ${command.skillId} to race ${command.raceId} for user ${command.userId}`);

    const race = await this.raceRepository.findById(command.raceId);
    if (!race) throw new NotFoundError('Race', command.raceId);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);
    race.addSkillBonus(command.skillId, command.specialization, command.bonus);

    const updated = await this.raceRepository.update(command.raceId, race);
    await this.events.publishChanges('race', race);
    return updated;
  }
}
