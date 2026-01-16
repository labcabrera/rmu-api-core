import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLanguageQuery } from '../queries/get-language.query';
import { Language } from 'src/modules/languages/domain/aggregates/language';
import type { LanguageRepository } from '../../ports/language-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';

@QueryHandler(GetLanguageQuery)
export class GetLanguageHandler implements IQueryHandler<GetLanguageQuery, Language> {
  constructor(@Inject('LanguageRepository') private readonly languageRepository: LanguageRepository) {}

  async execute(query: GetLanguageQuery): Promise<Language> {
    const data = await this.languageRepository.findById(query.id);
    if (!data) {
      throw new NotFoundError('Language', query.id);
    }
    return data;
  }
}
