import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Page } from 'src/modules/core/domain/entities/page';
import { GetLanguagesQuery } from '../queries/get-languages.query';
import { Language } from 'src/modules/languages/domain/aggregates/language';
import type { LanguageRepository } from '../../ports/language-repository';

@QueryHandler(GetLanguagesQuery)
export class GetLanguagesHandler implements IQueryHandler<GetLanguagesQuery, Page<Language>> {
  constructor(@Inject('LanguageRepository') private readonly languageRepository: LanguageRepository) {}

  async execute(query: GetLanguagesQuery): Promise<Page<Language>> {
    return await this.languageRepository.findByRsql(query.rsql, query.page, query.size);
  }
}
