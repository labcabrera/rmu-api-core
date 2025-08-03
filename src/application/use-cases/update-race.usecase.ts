import { UpdateRaceCommand } from '@application/commands/update-race.command';
import { Race } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class UpdateRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository
  ) {}

  async execute(command: UpdateRaceCommand): Promise<Race> {
    const race: Partial<Race> = { ...command, updatedAt: new Date() };
    return await this.raceRepository.update(command.id, race);
  }
}
