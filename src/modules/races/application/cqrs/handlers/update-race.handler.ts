import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import { UpdateRaceCommand } from '../commands/update-race.command';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import type { RaceRepository } from '../../ports/race-repository';
import { NotFoundError, ValidationError } from 'src/modules/shared/domain/errors/errors';
import type { LanguageRepository } from 'src/modules/languages/application/ports/language-repository';
import { Language } from 'src/modules/languages/domain/aggregates/language';

@CommandHandler(UpdateRaceCommand)
export class UpdateRaceHandler implements ICommandHandler<UpdateRaceCommand, Race> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: UpdateRaceCommand): Promise<Race> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) throw new NotFoundError('Race', command.id);

    let defaultLanguage: Language | null = null;
    if (command.defaultLanguageId) {
      defaultLanguage = await this.languageRepository.findById(command.defaultLanguageId);
      if (!defaultLanguage) throw new ValidationError(`Language with id ${command.defaultLanguageId} does not exist`);
    }

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
      defaultLanguage: defaultLanguage,
      talents: command.talents,
      traits: command.traits,
      description: command.description,
      imageUrl: command.imageUrl,
    });
    const updated = await this.raceRepository.update(command.id, race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return updated;
  }
}
