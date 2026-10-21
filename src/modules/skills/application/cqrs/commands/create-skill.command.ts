import { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { ManeuverProfile } from '../../../../skill-categories/domain/value-objects/maneuver-profile.vo';
import { AccessType } from '../../../../shared/domain/entities/access-type';

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
  ) {
    super(userId, roles);
  }
}
