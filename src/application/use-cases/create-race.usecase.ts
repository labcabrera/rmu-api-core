import { CreateRaceCommand } from '@application/commands/create-race.command';
import { Race } from '@domain/entities/race';
import { RaceRepository } from '@domain/ports/race-repository';
import { RealmRepository } from '@domain/ports/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class CreateRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    await this.realmRepository.findById(command.realm);

    const race: Partial<Race> = { ...command };
    return await this.raceRepository.save(race);
  }

  async existsById(id: string): Promise<boolean> {
    try {
      await this.realmRepository.findById(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
