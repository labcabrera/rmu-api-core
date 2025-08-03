import { CreateRaceCommand } from "@application/commands/create-race.command";
import { Race } from "@domain/entities/race";
import { RaceRepository } from "@domain/ports/race-repository";
import { RealmRepository } from "@domain/ports/realm-repository";
import { injectable } from "inversify";

@injectable()
export class CreateRaceUseCase {
  constructor(
    private readonly raceRepository: RaceRepository,
    private readonly realmRepository: RealmRepository
  ) {}

  async execute(command: CreateRaceCommand): Promise<Race> {
    const existingRealm = await this.realmRepository.findById(command.realm);
    if (!existingRealm) {
      throw new Error("Realm not found");
    }
    const race: Partial<Race> = {...command};
    return await this.raceRepository.save(race);
  }
}