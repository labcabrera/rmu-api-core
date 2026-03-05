import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import { CreateRaceCommand } from '../commands/create-race.command';
import type { RealmRepository } from 'src/modules/realms/application/ports/realm-repository';
import type { RaceRepository } from '../../ports/race-repository';
import type { RaceEventBusPort } from '../../ports/race-event-bus.port';
import { ValidationError } from 'src/modules/shared/domain/errors/errors';

@CommandHandler(CreateRaceCommand)
export class CreateRaceHandler implements ICommandHandler<CreateRaceCommand, Race> {
  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject('RaceEventProducer') private readonly raceEventBus: RaceEventBusPort,
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) {
      throw new ValidationError(`Realm with id ${command.realmId} does not exist`);
    }
    const race = Race.create({
      name: command.name,
      archetype: command.archetype,
      realmId: command.realmId,
      realmName: realm.name,
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
      raceTraits: command.raceTraits,
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
    });
    const savedRace = await this.raceRepository.save(race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return savedRace;
  }
}
