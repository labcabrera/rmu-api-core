import { Race } from 'src/modules/races/domain/aggregates/race';
import { BaseRepository } from 'src/modules/shared/application/ports/repository';

export interface RaceRepository extends BaseRepository<Race> {
  updateRealmName(realmId: string, realmName: string): Promise<void>;

  findByRealmId(realmId: string): Promise<Race[]>;
}
