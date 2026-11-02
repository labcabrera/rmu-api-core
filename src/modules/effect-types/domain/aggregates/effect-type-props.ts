import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import type { EffectPropertyRequirement } from '../value-objects/effect-property-requirement.vo.js';

export interface EffectTypeProps {
  id: string;
  isPersistent: boolean;
  isStackable: boolean;
  value: EffectPropertyRequirement;
  modifier: EffectPropertyRequirement;
  rounds: EffectPropertyRequirement;
  text: EffectPropertyRequirement;
  location: EffectPropertyRequirement;
  delay: EffectPropertyRequirement;
  owner: string;
  accessType: AccessType;
  entitySource: EntitySource;
  createdAt: Date;
  updatedAt?: Date;
}
