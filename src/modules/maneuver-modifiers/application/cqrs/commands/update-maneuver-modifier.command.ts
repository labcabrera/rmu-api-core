import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { ManeuverModifierUpdate } from '../../../domain/aggregates/maneuver-modifier';

export class UpdateManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly changes: ManeuverModifierUpdate,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
