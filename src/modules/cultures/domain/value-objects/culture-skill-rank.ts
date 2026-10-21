import { ValidationError } from '../../../shared/domain/errors/errors.js';

export const CULTURE_SKILL_RANK_TYPES = ['skill', 'skill-choice', 'category-pool', 'languages', 'region'] as const;

export type CultureSkillRankType = (typeof CULTURE_SKILL_RANK_TYPES)[number];

export const CULTURE_REGIONS = ['own', 'neighboring'] as const;

export type CultureRegion = (typeof CULTURE_REGIONS)[number];

export interface CultureSkillRankProps {
  type: CultureSkillRankType;
  skillId?: string;
  skillIds?: string[];
  specialization?: string;
  categoryIds?: string[];
  ranks: number;
  maxRanksPerSkill?: number;
  region?: CultureRegion;
}

/**
 * One entry of the culture ranks. `create` validates the fields each type needs; `fromProps`
 * rehydrates stored data without validating it.
 */
export class CultureSkillRank {
  private constructor(
    public readonly type: CultureSkillRankType,
    public readonly ranks: number,
    public readonly skillId?: string,
    public readonly skillIds?: string[],
    public readonly specialization?: string,
    public readonly categoryIds?: string[],
    public readonly maxRanksPerSkill?: number,
    public readonly region?: CultureRegion,
  ) {}

  static create(props: CultureSkillRankProps): CultureSkillRank {
    CultureSkillRank.validate(props);
    return CultureSkillRank.fromProps(props);
  }

  static fromProps(props: CultureSkillRankProps): CultureSkillRank {
    return new CultureSkillRank(
      props.type,
      props.ranks,
      props.skillId ?? undefined,
      props.skillIds ?? undefined,
      props.specialization ?? undefined,
      props.categoryIds ?? undefined,
      props.maxRanksPerSkill ?? undefined,
      props.region ?? undefined,
    );
  }

  private static validate(props: CultureSkillRankProps): void {
    if (!CULTURE_SKILL_RANK_TYPES.includes(props.type)) {
      throw new ValidationError(`Invalid culture skill rank type: ${String(props.type)}`);
    }
    if (!Number.isInteger(props.ranks) || props.ranks <= 0) {
      throw new ValidationError('Culture skill rank entries must give a positive whole number of ranks');
    }
    if (props.maxRanksPerSkill != null && (!Number.isInteger(props.maxRanksPerSkill) || props.maxRanksPerSkill <= 0)) {
      throw new ValidationError('maxRanksPerSkill must be a positive whole number');
    }
    const hasSkillId = !!props.skillId;
    const hasSkillIds = props.skillIds != null && props.skillIds.length > 0;
    const hasCategoryIds = props.categoryIds != null && props.categoryIds.length > 0;
    switch (props.type) {
      case 'skill':
        if (!hasSkillId) throw new ValidationError("Culture skill rank of type 'skill' requires skillId");
        if (hasSkillIds || hasCategoryIds || props.region) {
          throw new ValidationError("Culture skill rank of type 'skill' only accepts skillId and specialization");
        }
        break;
      case 'skill-choice':
        if (!hasSkillIds) throw new ValidationError("Culture skill rank of type 'skill-choice' requires a non-empty skillIds");
        if (hasSkillId || hasCategoryIds || props.region || props.specialization) {
          throw new ValidationError("Culture skill rank of type 'skill-choice' only accepts skillIds");
        }
        break;
      case 'category-pool':
        if (!hasCategoryIds) throw new ValidationError("Culture skill rank of type 'category-pool' requires a non-empty categoryIds");
        if (hasSkillId || hasSkillIds || props.region || props.specialization) {
          throw new ValidationError("Culture skill rank of type 'category-pool' only accepts categoryIds");
        }
        break;
      case 'languages':
        if (hasSkillId || hasSkillIds || hasCategoryIds || props.region || props.specialization) {
          throw new ValidationError("Culture skill rank of type 'languages' does not accept skill, category or region fields");
        }
        break;
      case 'region':
        if (!hasSkillId) throw new ValidationError("Culture skill rank of type 'region' requires skillId");
        if (!props.region || !CULTURE_REGIONS.includes(props.region)) {
          throw new ValidationError("Culture skill rank of type 'region' requires region 'own' or 'neighboring'");
        }
        if (hasSkillIds || hasCategoryIds || props.specialization) {
          throw new ValidationError("Culture skill rank of type 'region' only accepts skillId and region");
        }
        break;
    }
  }
}
