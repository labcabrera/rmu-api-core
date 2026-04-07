import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class DeleteRaceSkillBonusCommand extends AuthenticatedCommand {
  constructor(
    public readonly raceId: string,
    public readonly skillId: string,
    public readonly specialization: string | null,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
