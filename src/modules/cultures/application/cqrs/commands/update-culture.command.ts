import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { CultureSkillRankProps } from '../../../domain/value-objects/culture-skill-rank.js';

export class UpdateCultureCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly accessType: AccessType | undefined,
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
