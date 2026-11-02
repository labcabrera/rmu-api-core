import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Skill } from '../../domain/aggregates/skill.js';

export const SKILL_GUARD = Symbol('SkillGuardPort');

export type SkillGuardPort = EntityGuard<Skill>;
