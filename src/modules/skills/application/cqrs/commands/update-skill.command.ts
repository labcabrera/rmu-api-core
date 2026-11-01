import type { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ManeuverProfile } from '../../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

export class UpdateSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly categoryId: string | undefined,
    public readonly bonus: string[] | undefined,
    public readonly specialization: EnumerationCategory | undefined,
    public readonly accessType: AccessType | undefined,
    /** undefined keeps the current profile, null removes it. */
    public readonly maneuver: ManeuverProfile | null | undefined,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
    /** undefined keeps the current value. */
    public readonly specializationOptional?: boolean,
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
  ) {
    super(userId, roles);
  }
}
