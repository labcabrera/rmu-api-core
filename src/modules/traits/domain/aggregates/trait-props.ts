import type { TraitCategory } from '../value-objects/trait-category.vo.js';
import type { TraitDetails } from '../value-objects/trait-details.vo.js';
import type { TraitSpecialization } from '../value-objects/trait-specialization.vo.js';

export interface TraitProps extends TraitDetails {
  id: string;
  name: string;
  category: TraitCategory;
  isTalent: boolean;
  specialization: TraitSpecialization | null;
  isTierBased: boolean;
  maxTier: number | undefined;
  adquisitionCost: number;
  tierCost: number | undefined;
  description: string | undefined;
  owner: string;
  createdAt: Date;
  updatedAt?: Date;
}
