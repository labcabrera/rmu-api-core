import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { AccessType } from '../../../../shared/domain/entities/access-type';
import { ManeuverModifierDefinition } from '../../../domain/aggregates/maneuver-modifier-props';

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
