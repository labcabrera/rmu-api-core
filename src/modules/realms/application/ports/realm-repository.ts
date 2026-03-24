import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';

export type RealmRepository = BaseRepository<Realm>;
