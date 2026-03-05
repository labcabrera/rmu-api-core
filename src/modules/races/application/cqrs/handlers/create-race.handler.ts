import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import { CreateRaceCommand } from '../commands/create-race.command';
import type { RealmRepository } from 'src/modules/realms/application/ports/realm-repository';
import type { RaceRepository } from '../../ports/race-repository';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import { ValidationError } from 'src/modules/shared/domain/errors/errors';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import type { LanguageRepository } from 'src/modules/languages/application/ports/language-repository';
import { Language } from 'src/modules/languages/domain/aggregates/language';

@CommandHandler(CreateRaceCommand)
export class CreateRaceHandler implements ICommandHandler<CreateRaceCommand, Race> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) throw new ValidationError(`Realm with id ${command.realmId} does not exist`);

    let language: Language | null = null;
    if (command.defaultLanguageId) {
      language = await this.languageRepository.findById(command.defaultLanguageId);
      if (!language) throw new ValidationError(`Language with id ${command.defaultLanguageId} does not exist`);
    }

    const race = Race.create({
      name: command.name,
      archetype: command.archetype,
      realm: new NamedEntity(realm.id, realm.name),
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
      defaultLanguage: language,
      talents: command.talents,
      traits: command.traits,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
    });
    const savedRace = await this.raceRepository.save(race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return savedRace;
  }
}
