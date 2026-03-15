import { Language } from 'src/modules/languages/domain/aggregates/language';
import { BaseRepository } from 'src/modules/shared/application/ports/repository';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export interface LanguageRepository extends BaseRepository<Language> {
  updateRealmInfo(realmId: string, realmName: string, accessType: AccessType): Promise<void>;
}
