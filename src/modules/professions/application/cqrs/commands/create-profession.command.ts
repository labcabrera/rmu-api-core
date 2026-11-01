import type { ProfessionArchetype } from '../../../domain/value-objects/profession-archetype.vo.js';
import type { ProfessionSkillCosts } from '../../../domain/value-objects/profession-skill-cost.vo.js';
import type { RealmType } from '../../../domain/value-objects/realm-type.vo.js';
import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../../shared/domain/entities/entity-source.js';

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
    /** Spec 063: only an admin asks for `system`; undefined is `user` on create and no change on update. */
    public readonly entitySource?: EntitySource,
    /** Spec 064: most base lists developed as base; undefined or null has no limit */
    public readonly baseListLimit?: number | null,
  ) {
    super(userId, roles);
  }
}
