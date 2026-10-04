import { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { EntitySource } from 'src/modules/shared/domain/entities/entity-source';
import { EffectPropertyRequirement } from '../value-objects/effect-property-requirement.vo';

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
