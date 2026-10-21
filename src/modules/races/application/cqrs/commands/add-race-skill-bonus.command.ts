import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class AddRaceSkillBonusCommand extends AuthenticatedCommand {
  constructor(
    public readonly raceId: string,
    public readonly skillId: string,
    public readonly specialization: string | null,
    public readonly bonus: number,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
