import { BaseEntityGuard } from 'src/modules/shared/infrastructure/security/base-entity-guard';
import { SkillGuardPort } from '../../application/ports/skill-guard';
import { Skill } from '../../domain/aggregates/skill';

export class SkillGuardAdapter extends BaseEntityGuard<Skill> implements SkillGuardPort {}
