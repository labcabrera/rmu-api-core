import { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo';
import { ProfessionSkillCosts } from '../../../domain/value-objects/profession-skill-cost.vo';
import { RealmType } from '../../../domain/value-objects/realm-type.vo';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';
import { AccessType } from '../../../../shared/domain/entities/access-type';

export class CreateProfessionCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly archetype: ProfessionArchetype,
    public readonly availableRealmTypes: RealmType[],
    public readonly fixedRealmTypes: RealmType[],
    public readonly skillCosts: ProfessionSkillCosts,
    public readonly professionalSkills: string[],
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly accessType: AccessType,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
