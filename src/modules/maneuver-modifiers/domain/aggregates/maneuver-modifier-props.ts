import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { ManeuverModifierOption, ManeuverModifierScope, ManeuverModifierType } from '../value-objects/maneuver-modifier-type.vo.js';

export interface ManeuverModifierProps {
  id: string;
  key: string;
  scope: ManeuverModifierScope;
  type: ManeuverModifierType;
  value?: number;
  options?: ManeuverModifierOption[];
  perUnit?: number;
  min?: number;
  max?: number;
  description?: string;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt?: Date;
}

export type ManeuverModifierDefinition = Pick<
  ManeuverModifierProps,
  'key' | 'scope' | 'type' | 'value' | 'options' | 'perUnit' | 'min' | 'max' | 'description'
>;
