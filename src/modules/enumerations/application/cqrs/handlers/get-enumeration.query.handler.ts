import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetEnumerationQuery } from '../queries/get-enumeration.query';
import type { EnumerationRepository } from '../../ports/enumeration-repository';
import type { EnumerationGuardPort } from '../../ports/enumeration-guard';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { Enumeration } from 'src/modules/enumerations/domain/aggregates/enumeration';

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
