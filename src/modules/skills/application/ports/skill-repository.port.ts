import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import { Skill } from '../../domain/aggregates/skill.js';

export const SKILL_REPOSITORY = Symbol('SkillRepository');

export type SkillRepository = BaseRepository<Skill>;
