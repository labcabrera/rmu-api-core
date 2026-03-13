import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLanguageQuery } from '../queries/get-language.query';
import { Language } from 'src/modules/languages/domain/aggregates/language';
import type { LanguageRepository } from '../../ports/language-repository';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import type { LanguageGuardPort } from '../../ports/language-guard.port';

@QueryHandler(GetLanguageQuery)
export class GetLanguageHandler implements IQueryHandler<GetLanguageQuery, Language> {
  constructor(
    @Inject('LanguageRepository') private readonly languageRepository: LanguageRepository,
    @Inject('LanguageGuardPort') private readonly languageGuardPort: LanguageGuardPort,
  ) {}

  async execute(query: GetLanguageQuery): Promise<Language> {
    const current = await this.languageRepository.findById(query.id);
    if (!current) throw new NotFoundError('Language', query.id);

    this.languageGuardPort.checkRead(current, query.userId, query.roles);

    return current;
  }
}
