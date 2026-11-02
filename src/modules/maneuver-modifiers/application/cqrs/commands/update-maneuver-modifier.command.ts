import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ManeuverModifierUpdate } from '../../../domain/aggregates/maneuver-modifier.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class UpdateManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly changes: ManeuverModifierUpdate,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
