import { Realm } from '@domain/entities/realm';
import { RealmQuery } from '@domain/queries/realm-query';
import { Repository } from './repository';

export interface RealmRepository extends Repository<Realm, RealmQuery> {}
