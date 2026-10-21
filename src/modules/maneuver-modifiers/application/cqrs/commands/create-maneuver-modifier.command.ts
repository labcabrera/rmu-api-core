import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { ManeuverModifierDefinition } from '../../../domain/aggregates/maneuver-modifier-props.js';

export class CreateManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly definition: ManeuverModifierDefinition,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
