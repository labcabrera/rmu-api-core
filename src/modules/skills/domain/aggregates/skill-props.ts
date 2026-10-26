import type { EnumerationCategory } from '../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import type { ManeuverProfile } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';

export interface SkillProps {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: EnumerationCategory | null;
  /** The specialization is suggested, not required: the skill can be developed without one (spec 037). */
  specializationOptional?: boolean;
  owner: string;
  accessType: AccessType;
  /** Own maneuver profile: only the fields that override the category profile. */
  maneuver?: ManeuverProfile | null;
  createdAt: Date;
  updatedAt?: Date;
}
