import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ManeuverModifierUpdate } from '../../../domain/aggregates/maneuver-modifier.js';

export class UpdateManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly changes: ManeuverModifierUpdate,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
