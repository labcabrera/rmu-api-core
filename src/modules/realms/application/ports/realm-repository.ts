import { Realm } from '../../domain/aggregates/realm.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';

export type RealmRepository = BaseRepository<Realm>;
