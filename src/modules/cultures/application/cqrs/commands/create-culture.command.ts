import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { AccessType } from '../../../../shared/domain/entities/access-type';
import { CultureSkillRankProps } from '../../../domain/value-objects/culture-skill-rank';

export class CreateCultureCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
    public readonly imageUrl: string | null,
    public readonly accessType: AccessType,
    public readonly skillRanks: CultureSkillRankProps[] | undefined,
    public readonly languages: string[] | undefined,
    public readonly suggestedCrafts: string | undefined,
    public readonly suggestedVocations: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
