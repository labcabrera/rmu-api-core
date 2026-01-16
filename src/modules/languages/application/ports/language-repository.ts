import { Language } from 'src/modules/languages/domain/aggregates/language';
import { Page } from 'src/modules/shared/domain/entities/page';

export interface LanguageRepository {
  findById(id: string): Promise<Language | null>;

  findByRsql(rsql: string | undefined, page: number, size: number): Promise<Page<Language>>;

  save(entity: Language): Promise<Language>;

  update(languageId: string, update: Partial<Language>): Promise<Language>;

  deleteById(id: string): Promise<Language | null>;
}
