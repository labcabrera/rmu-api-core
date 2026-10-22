import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Page } from '../../../../shared/application/pagination/page.js';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier.js';
import { MANEUVER_MODIFIER_GUARD, type ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY, type ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.port.js';
import { GetManeuverModifiersQuery } from '../queries/get-maneuver-modifiers.query.js';

@QueryHandler(GetManeuverModifiersQuery)
export class GetManeuverModifiersHandler implements IQueryHandler<GetManeuverModifiersQuery, Page<ManeuverModifier>> {
  constructor(
    @Inject(MANEUVER_MODIFIER_REPOSITORY) private readonly repository: ManeuverModifierRepository,
    @Inject(MANEUVER_MODIFIER_GUARD) private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(query: GetManeuverModifiersQuery): Promise<Page<ManeuverModifier>> {
    const filter = this.guard.buildQueryPredicate(query.userId, query.roles);
    return await this.repository.findByRsql(query.rsql, query.page, query.size, filter, { key: 'asc' });
  }
}
