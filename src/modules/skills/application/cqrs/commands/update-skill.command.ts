import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { ManeuverProfile } from 'src/modules/skill-categories/domain/value-objects/maneuver-profile.vo';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

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
  ) {
    super(userId, roles);
  }
}
