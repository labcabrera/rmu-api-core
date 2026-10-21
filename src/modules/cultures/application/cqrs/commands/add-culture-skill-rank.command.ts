import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { CultureSkillRankProps } from '../../../domain/value-objects/culture-skill-rank.js';

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
