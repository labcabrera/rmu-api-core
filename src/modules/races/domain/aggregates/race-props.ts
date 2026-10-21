import { RaceResistances } from '../value-objects/race-resistances.vo.js';
import { RaceStats } from '../value-objects/race-stats.vo.js';
import { RaceTrait } from '../value-objects/race-trait.vo.js';
import type { SexBasedAttribute } from '../value-objects/sex-based-attribute.vo.js';
import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import { RaceSkillBonus } from '../value-objects/race-skill-bonus.vo.js';

export interface RaceProps {
  id: string;
  archetype: string;
  name: string;
  realmId: string;
  sizeId: string;
  stats: RaceStats;
  resistances: RaceResistances;
  averageHeight: SexBasedAttribute;
  averageWeight: SexBasedAttribute;
  strideBonus: number;
  enduranceBonus: number;
  recoveryMultiplier: number;
  baseHits: number;
  baseDevPoints: number;
  baseAt: number;
  defaultLanguage: string | null;
  talents: string[];
  traits: RaceTrait[];
  skillBonuses: RaceSkillBonus[];
  description: string | null;
  imageUrl: string | null;
  owner: string;
  accessType: AccessType;
  createdAt: Date;
  updatedAt: Date | null;
}
