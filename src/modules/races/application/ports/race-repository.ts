import { Race } from '../../domain/aggregates/race.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';

export interface RaceRepository extends BaseRepository<Race> {
  updateRealmInfo(realmId: string, realmName: string, owner: string, acessType: AccessType): Promise<void>;

  findByRealmId(realmId: string): Promise<Race[]>;
}
