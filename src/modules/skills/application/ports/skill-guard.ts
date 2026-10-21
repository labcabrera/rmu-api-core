import { EntityGuard } from '../../../shared/application/ports/entity-guard';
import { Skill } from '../../domain/aggregates/skill';

export type SkillGuardPort = EntityGuard<Skill>;
