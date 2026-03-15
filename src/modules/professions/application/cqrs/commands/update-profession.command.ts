import { ProfessionArchetype } from 'src/modules/professions/domain/value-objects/profession-archetype.vo';
import { ProfessionSkillCosts } from 'src/modules/professions/domain/value-objects/profession-skill-cost.vo';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';
import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { AccessType } from 'src/modules/shared/domain/entities/access-type';

export class UpdateProfessionCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly archetype: ProfessionArchetype | undefined,
    public readonly availableRealmTypes: RealmType[] | undefined,
    public readonly fixedRealmTypes: RealmType[] | undefined,
    public readonly skillCosts: ProfessionSkillCosts | undefined,
    public readonly professionalSkills: string[] | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    public readonly accessType: AccessType | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
