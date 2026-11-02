import { Realm } from '../../domain/aggregates/realm.js';
import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';

export const REALM_REPOSITORY = Symbol('RealmRepository');

export type RealmRepository = BaseRepository<Realm>;
