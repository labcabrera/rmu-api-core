import type { EffectiveManeuverProfile } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import { Skill } from '../../domain/aggregates/skill.js';

/** Skill plus its effective maneuver profile (category profile overridden by the skill one). */
export interface SkillView {
  skill: Skill;
  maneuver: EffectiveManeuverProfile;
}
