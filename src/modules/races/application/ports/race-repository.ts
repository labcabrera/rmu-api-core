import { Race } from '../../domain/aggregates/race';
import { BaseRepository } from '../../../shared/application/ports/base-repository';
import { AccessType } from '../../../shared/domain/entities/access-type';

export interface RaceRepository extends BaseRepository<Race> {
  updateRealmInfo(realmId: string, realmName: string, owner: string, acessType: AccessType): Promise<void>;

  findByRealmId(realmId: string): Promise<Race[]>;
}
