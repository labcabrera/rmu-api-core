import type { SkillDifficultyGuide } from '../../domain/value-objects/skill-difficulty-guide.vo.js';

export const SKILL_DIFFICULTY_REPOSITORY = Symbol('SkillDifficultyRepository');

/** Difficulty guides stored in the database (collection skill-difficulties, one document per skill). */
export interface SkillDifficultyRepository {
  findById(skillId: string): Promise<SkillDifficultyGuide | null>;
  findAll(): Promise<SkillDifficultyGuide[]>;
}
