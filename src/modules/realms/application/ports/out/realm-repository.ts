import { Realm } from 'src/modules/realms/domain/entities/realm';
import { Repository } from '../../../../core/application/ports/out/repository';

export type RealmRepository = Repository<Realm>;
