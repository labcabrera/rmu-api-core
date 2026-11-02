import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteCultureSkillRankCommand extends AuthenticatedCommand {
  constructor(
    public readonly cultureId: string,
    public readonly index: number,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
