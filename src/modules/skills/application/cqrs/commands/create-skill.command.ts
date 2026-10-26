import type { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ManeuverProfile } from '../../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export class CreateSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly categoryId: string,
    public readonly bonus: string[],
    public readonly specialization: EnumerationCategory | null,
    public readonly accessType: AccessType,
    public readonly maneuver: ManeuverProfile | undefined,
    userId: string,
    roles: string[],
    public readonly specializationOptional?: boolean,
  ) {
    super(userId, roles);
  }
}
