import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Language } from '../../domain/aggregates/language';

export type LanguageGuardPort = EntityGuard<Language>;
