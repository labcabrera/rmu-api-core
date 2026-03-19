import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class CreateSkillCategoryCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly bonus: string[],
    public readonly realmBonus: number | null,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
