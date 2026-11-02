import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import { CultureSkillRank } from '../value-objects/culture-skill-rank.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';

export interface CultureProps {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  /** Rulebook (`system`, admin-only changes) or user content (spec 063). */
  entitySource: EntitySource;
  skillRanks: CultureSkillRank[];
  languages?: string[];
  suggestedCrafts?: string;
  suggestedVocations?: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type CreateCultureProps = Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCultureProps = Partial<Omit<CultureProps, 'id' | 'createdAt' | 'updatedAt' | 'owner'>>;
