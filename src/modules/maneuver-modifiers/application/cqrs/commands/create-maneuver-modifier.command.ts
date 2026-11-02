import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { ManeuverModifierDefinition } from '../../../domain/aggregates/maneuver-modifier-props.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class CreateManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly definition: ManeuverModifierDefinition,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
