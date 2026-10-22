import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationQuery } from '../queries/get-enumeration.query.js';
import { ENUMERATION_REPOSITORY, type EnumerationRepository } from '../../ports/enumeration-repository.port.js';
import { ENUMERATION_GUARD, type EnumerationGuardPort } from '../../ports/enumeration-guard.port.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';

@QueryHandler(GetEnumerationQuery)
export class GetEnumerationHandler implements IQueryHandler<GetEnumerationQuery, Enumeration> {
  constructor(
    @Inject(ENUMERATION_REPOSITORY) private readonly skillRepository: EnumerationRepository,
    @Inject(ENUMERATION_GUARD) private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(query: GetEnumerationQuery): Promise<Enumeration> {
    const current = await this.skillRepository.findById(query.id);
    if (!current) throw new NotFoundError('Enumeration', query.id);
    this.guard.checkRead(current, query.userId, query.roles);
    return current;
  }
}
