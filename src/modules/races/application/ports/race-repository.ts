import { Race } from 'src/modules/races/domain/aggregates/race';
import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export interface RaceRepository extends BaseRepository<Race> {
  updateRealmInfo(realmId: string, realmName: string, owner: string, acessType: AccessType): Promise<void>;

  findByRealmId(realmId: string): Promise<Race[]>;
}
