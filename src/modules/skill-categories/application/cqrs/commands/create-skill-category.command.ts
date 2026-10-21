import { ManeuverProfile } from 'src/modules/skill-categories/domain/value-objects/maneuver-profile.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class CreateSkillCategoryCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly bonus: string[],
    public readonly realmBonus: number | null,
    public readonly maneuver: ManeuverProfile | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
