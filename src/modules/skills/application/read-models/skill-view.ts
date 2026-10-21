import { EffectiveManeuverProfile } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo';
import { Skill } from '../../domain/aggregates/skill';

/** Skill plus its effective maneuver profile (category profile overridden by the skill one). */
export interface SkillView {
  skill: Skill;
  maneuver: EffectiveManeuverProfile;
}
