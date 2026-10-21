import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import { Skill } from '../../domain/aggregates/skill.js';

export type SkillRepository = BaseRepository<Skill>;
