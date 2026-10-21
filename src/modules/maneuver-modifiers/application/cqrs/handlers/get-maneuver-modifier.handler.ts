import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from '../../../../shared/domain/errors/errors.js';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier.js';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port.js';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository.js';
import { GetManeuverModifierQuery } from '../queries/get-maneuver-modifier.query.js';

@QueryHandler(GetManeuverModifierQuery)
export class GetManeuverModifierHandler implements IQueryHandler<GetManeuverModifierQuery, ManeuverModifier> {
  constructor(
    @Inject('ManeuverModifierRepository') private readonly repository: ManeuverModifierRepository,
    @Inject('ManeuverModifierGuardPort') private readonly guard: ManeuverModifierGuardPort,
  ) {}

  async execute(query: GetManeuverModifierQuery): Promise<ManeuverModifier> {
    const modifier = await this.repository.findById(query.id);
    if (!modifier) throw new NotFoundError('ManeuverModifier', query.id);
    this.guard.checkRead(modifier, query.userId, query.roles);
    return modifier;
  }
}
