import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

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
