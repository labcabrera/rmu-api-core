import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { SkillGuardPort } from '../../application/ports/skill-guard.port.js';
import { Skill } from '../../domain/aggregates/skill.js';

export class SkillGuardAdapter extends BaseEntityGuard<Skill> implements SkillGuardPort {}
