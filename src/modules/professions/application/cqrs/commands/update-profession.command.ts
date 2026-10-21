import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { ProfessionSkillCosts } from '../../../domain/value-objects/profession-skill-cost.vo.js';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

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
