import { Realm } from '@domain/entities/realm';
import { Repository } from './repository';

export interface RealmRepository extends Repository<Realm> {}
