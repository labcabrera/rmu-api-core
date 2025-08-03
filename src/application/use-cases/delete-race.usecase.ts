import { DeleteRaceCommand } from '@application/commands/delete-race.command';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    return await this.raceRepository.deleteById(command.id);
  }
}
