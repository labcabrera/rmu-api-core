import { CreateRaceCommand } from '@application/commands/create-race.command';
import { Race } from '@domain/entities/race';
import { ConflictError, ValidationError } from '@domain/errors/errors';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { inject, injectable } from 'inversify';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { RaceCreatedEvent } from '@domain/events/race-created.event';

@injectable()
export class CreateRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('EventNotificationPort') private readonly eventNotificationPort: EventNotificationPort
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    const realm = await this.realmRepository.findById(command.realm);
    if (!realm) {
      throw new ValidationError(`Realm with id ${command.realm} does not exist`);
    }
    const existing = await this.raceRepository.findById(command.id);
    if (existing) {
      throw new ConflictError(`Race with id ${command.id} already exists`);
    }
    const race: Partial<Race> = {
      id: command.id,
      name: command.name,
      realm: command.realm,
      size: command.size,
      defaultStatBonus: command.defaultStatBonus,
      resistances: command.resistances,
      averageHeight: command.averageHeight,
      averageWeight: command.averageWeight,
      strideBonus: command.strideBonus,
      enduranceBonus: command.enduranceBonus,
      recoveryMultiplier: command.recoveryMultiplier,
      baseHits: command.baseHits,
      bonusDevPoints: command.bonusDevPoints,
      description: command.description,
      owner: command.username,
      createdAt: new Date(),
    };
    const savedRace = await this.raceRepository.save(race);
    await this.eventNotificationPort.notify(new RaceCreatedEvent(savedRace));
    return savedRace;
  }
}
