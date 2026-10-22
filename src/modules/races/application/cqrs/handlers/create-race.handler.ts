import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Race } from '../../../domain/aggregates/race.js';
import { CreateRaceCommand } from '../commands/create-race.command.js';
import type { RealmRepository } from '../../../../realms/application/ports/realm-repository.js';
import type { RaceRepository } from '../../ports/race-repository.js';
import { ValidationError } from '../../../../shared/domain/errors/errors.js';
import { DOMAIN_EVENT_PUBLISHER, type DomainEventPublisher } from '../../../../shared/application/ports/domain-event-publisher.js';

@CommandHandler(CreateRaceCommand)
export class CreateRaceHandler implements ICommandHandler<CreateRaceCommand, Race> {
  private readonly logger = new Logger(CreateRaceHandler.name);

  constructor(
    @Inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @Inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    this.logger.log(`Creating race ${command.name} for user ${command.userId} in realm ${command.realmId}`);

    const realm = await this.realmRepository.findById(command.realmId);
    if (!realm) throw new ValidationError(`Realm with id ${command.realmId} does not exist`);

    const race = Race.create({
      name: command.name,
      archetype: command.archetype,
      realmId: realm.id,
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
      skillBonuses: [],
      description: command.description,
      imageUrl: command.imageUrl,
      owner: command.userId,
      accessType: realm.accessType,
    });
    const savedRace = await this.raceRepository.save(race);
    await this.events.publishChanges('race', race);
    return savedRace;
  }
}
