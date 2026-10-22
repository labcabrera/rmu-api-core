import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier.js';
import { MANEUVER_MODIFIER_GUARD, type ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import { MANEUVER_MODIFIER_REPOSITORY, type ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.port.js';
import { GetManeuverModifierQuery } from '../queries/get-maneuver-modifier.query.js';

@QueryHandler(GetManeuverModifierQuery)
export class GetManeuverModifierHandler implements IQueryHandler<GetManeuverModifierQuery, ManeuverModifier> {
  constructor(
    @Inject(MANEUVER_MODIFIER_REPOSITORY) private readonly repository: ManeuverModifierRepository,
    @Inject(MANEUVER_MODIFIER_GUARD) private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(query: GetManeuverModifierQuery): Promise<ManeuverModifier> {
    const modifier = await this.repository.findById(query.id);
    if (!modifier) throw new NotFoundError('ManeuverModifier', query.id);
    this.guard.checkRead(modifier, query.userId, query.roles);
    return modifier;
  }
}
