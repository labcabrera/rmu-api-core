import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteSkillCommand extends AuthenticatedCommand {
  constructor(
    public readonly skillId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
