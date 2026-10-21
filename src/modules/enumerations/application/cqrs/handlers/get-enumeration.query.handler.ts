import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationQuery } from '../queries/get-enumeration.query.js';
import type { EnumerationRepository } from '../../ports/enumeration-repository.js';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard.js';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { Enumeration } from '../../../domain/aggregates/enumeration.js';

@QueryHandler(GetEnumerationQuery)
export class GetEnumerationHandler implements IQueryHandler<GetEnumerationQuery, Enumeration> {
  constructor(
    @Inject('EnumerationRepository') private readonly skillRepository: EnumerationRepository,
    @Inject('EnumerationGuardPort') private readonly guard: EnumerationGuardPort,
  ) {}

  async execute(query: GetEnumerationQuery): Promise<Enumeration> {
    const current = await this.skillRepository.findById(query.id);
    if (!current) throw new NotFoundError('Enumeration', query.id);
    this.guard.checkRead(current, query.userId, query.roles);
    return current;
  }
}
