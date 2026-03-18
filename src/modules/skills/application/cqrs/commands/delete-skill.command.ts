import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class DeleteSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly skillId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
