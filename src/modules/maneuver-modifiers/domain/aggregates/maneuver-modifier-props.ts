import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { ManeuverModifierOption, ManeuverModifierScope, ManeuverModifierType } from '../value-objects/maneuver-modifier-type.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';

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
  /** Reference only (e.g. OB/DB modifiers of a combat skill): listed, never added to a maneuver roll. */
  reference?: boolean;
  owner: string;
  accessType: AccessType;
  /** Rulebook (`system`, admin-only changes) or user content (spec 063). */
  entitySource: EntitySource;
  createdAt: Date;
  updatedAt?: Date;
}

export type ManeuverModifierDefinition = Pick<
  ManeuverModifierProps,
  'key' | 'scope' | 'type' | 'value' | 'options' | 'perUnit' | 'min' | 'max' | 'description' | 'reference'
>;
