import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ManeuverModifierUpdate } from '../../../domain/aggregates/maneuver-modifier.js';

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
