import { Race } from 'src/modules/races/domain/aggregates/race';
import { BaseRepository } from 'src/modules/shared/application/ports/repository';

export interface RaceRepository extends BaseRepository<Race> {
  updateRealmInfo(realmId: string, realmName: string, owner: string): Promise<void>;

  findByRealmId(realmId: string): Promise<Race[]>;
}
