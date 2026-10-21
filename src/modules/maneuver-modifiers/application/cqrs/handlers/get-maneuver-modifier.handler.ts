import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundError } from 'src/modules/shared/domain/errors/errors';
import { ManeuverModifier } from '../../../domain/aggregates/maneuver-modifier';
import type { ManeuverModifierGuardPort } from '../../ports/maneuver-modifier-guard.port';
import type { ManeuverModifierRepository } from '../../ports/maneuver-modifier-repository';
import { GetManeuverModifierQuery } from '../queries/get-maneuver-modifier.query';

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
