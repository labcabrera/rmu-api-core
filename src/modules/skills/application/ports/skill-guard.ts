import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Skill } from '../../domain/aggregates/skill.js';

export type SkillGuardPort = EntityGuard<Skill>;
