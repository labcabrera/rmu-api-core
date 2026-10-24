import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import { UpdateRaceCommand } from '../commands/update-race.command.js';
import { RACE_REPOSITORY, type RaceRepository } from '../../ports/race-repository.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { RACE_GUARD, type RaceGuardPort } from '../../ports/race-guard.port.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.port.js';

@CommandHandler(UpdateRaceCommand)
export class UpdateRaceHandler implements ICommandHandler<UpdateRaceCommand, Race> {
  constructor(
    @Inject(RACE_REPOSITORY) private readonly raceRepository: RaceRepository,
    @Inject(RACE_GUARD) private readonly raceGuard: RaceGuardPort,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: UpdateRaceCommand): Promise<Race> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) throw new NotFoundError('Race', command.id);

    this.raceGuard.checkUpdate(race, command.userId, command.roles);

    race.checkVersion(command.expectedVersion);

    race.update({
      name: command.name,
      archetype: command.archetype,
      sizeId: command.sizeId,
      stats: command.stats,
      resistances: command.resistances,
      averageHeight: command.averageHeight,
      averageWeight: command.averageWeight,
      strideBonus: command.strideBonus,
      enduranceBonus: command.enduranceBonus,
      recoveryMultiplier: command.recoveryMultiplier,
      baseHits: command.baseHits,
      baseDevPoints: command.baseDevPoints,
      baseAt: command.baseAt,
      defaultLanguage: command.defaultLanguage,
      talents: command.talents,
      traits: command.traits,
      description: command.description,
      imageUrl: command.imageUrl,
    });
    const updated = await this.raceRepository.update(race);
    await this.events.publishChanges('race', race);
    return updated;
  }
}
