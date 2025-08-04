import { DeleteRaceCommand } from '@application/commands/delete-race.command';
import { RaceEventService } from '@application/services/race-event.service';
import { NotFoundError } from '@domain/errors/errors';
import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { inject, injectable } from 'inversify';

@injectable()
export class DeleteRaceUseCase {
  constructor(
    @inject('RaceRepository') private readonly raceRepository: RaceRepository,
    @inject('RealmRepository') private readonly realmRepository: RealmRepository,
    @inject('RaceEventService') private readonly raceEventService: RaceEventService
  ) {}

  async execute(command: DeleteRaceCommand): Promise<void> {
    const race = await this.raceRepository.findById(command.id);
    if (!race) {
      throw new NotFoundError('Race', command.id);
    }
    await this.raceRepository.deleteById(command.id);
    await this.raceEventService.deleted(command.id, race, command.username, command.reason);
  }
}
