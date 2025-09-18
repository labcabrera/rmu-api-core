import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race';
import { ValidationError } from '../../../../core/domain/errors/errors';
import { CreateRaceCommand } from '../commands/create-race.command';
import type { RaceRepository } from '../../ports/out/race-repository';
import type { RealmRepository } from 'src/modules/realms/application/ports/out/realm-repository';
import type { RaceEventBusPort } from '../../ports/out/race-event-bus.port';

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
    const race = Race.create(
      command.name,
      command.realmId,
      realm.name,
      command.sizeId,
      command.stats,
      command.resistances,
      command.averageHeight,
      command.averageWeight,
      command.strideBonus,
      command.enduranceBonus,
      command.recoveryMultiplier,
      command.baseHits,
      command.baseDevPoints,
      command.baseAt,
      command.defaultLanguage,
      command.talents,
      command.description,
      command.userId,
    );
    const savedRace = await this.raceRepository.save(race);
    race.getUncommittedEvents().forEach((event) => this.raceEventBus.publish(event));
    return savedRace;
  }
}
