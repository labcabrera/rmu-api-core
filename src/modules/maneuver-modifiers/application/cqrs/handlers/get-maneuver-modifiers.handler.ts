import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Page } from 'src/modules/shared/domain/entities/page';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { GetManeuverModifiersQuery } from '../queries/get-maneuver-modifiers.query';

@QueryHandler(GetManeuverModifiersQuery)
export class GetManeuverModifiersHandler implements IQueryHandler<GetManeuverModifiersQuery, Page<ManeuverModifier>> {
  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(query: GetManeuverModifiersQuery): Promise<Page<ManeuverModifier>> {
    const filter = this.guard.buildQueryPredicate(query.userId, query.roles);
    return await this.repository.findByRsql(query.rsql, query.page, query.size, filter, { key: 'asc' });
  }
}
