import { Realm } from '../../domain/aggregates/realm';
import { BaseRepository } from '../../../shared/application/ports/base-repository';

export type RealmRepository = BaseRepository<Realm>;
