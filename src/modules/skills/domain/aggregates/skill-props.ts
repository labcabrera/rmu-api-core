import { EnumerationCategory } from '../../../enumerations/domain/value-objects/enumeration-category.vo';
import { ManeuverProfile } from '../../../skill-categories/domain/value-objects/maneuver-profile.vo';
import { AccessType } from '../../../shared/domain/entities/access-type';

export interface SkillProps {
  id: string;
  categoryId: string;
  bonus: string[];
  specialization: EnumerationCategory | null;
  owner: string;
  accessType: AccessType;
  /** Own maneuver profile: only the fields that override the category profile. */
  maneuver?: ManeuverProfile | null;
  createdAt: Date;
  updatedAt?: Date;
}
