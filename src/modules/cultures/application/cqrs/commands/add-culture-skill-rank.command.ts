import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { CultureSkillRankProps } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

export class AddCultureSkillRankCommand extends AuthenticatedCommand {
  constructor(
    public readonly cultureId: string,
    public readonly skillRank: CultureSkillRankProps,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
