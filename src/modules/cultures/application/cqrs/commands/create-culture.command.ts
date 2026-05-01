import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { CultureSkillRank } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

export class CreateCultureCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly accessType: AccessType,
    public readonly fixedSkillRanks: CultureSkillRank[] | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
