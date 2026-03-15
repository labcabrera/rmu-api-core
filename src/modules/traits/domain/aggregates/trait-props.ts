import { TraitCategory } from '../value-objects/trait-category.vo';
import { TraitSpecialization } from '../value-objects/trait-specialization.vo';

export interface TraitProps {
  id: string;
  name: string;
  category: TraitCategory;
  isTalent: boolean;
  specialization: TraitSpecialization;
  isTierBased: boolean;
  maxTier: number | undefined;
  adquisitionCost: number;
  tierCost: number | undefined;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
