import type { ManeuverProfile } from '../../../domain/value-objects/maneuver-profile.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

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
