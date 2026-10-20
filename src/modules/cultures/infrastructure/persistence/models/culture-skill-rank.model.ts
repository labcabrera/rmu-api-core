import { Prop, Schema } from '@nestjs/mongoose';
import type { CultureRegion, CultureSkillRankType } from 'src/modules/cultures/domain/value-objects/culture-skill-rank';

@Schema({ _id: false })
export class CultureSkillRankModel {
  @Prop({ type: String, required: true })
  type: CultureSkillRankType;

  @Prop({ type: String, required: false })
  skillId?: string;

  @Prop({ type: [String], required: false, default: undefined })
  skillIds?: string[];

  @Prop({ type: String, required: false })
  specialization?: string;

  @Prop({ type: [String], required: false, default: undefined })
  categoryIds?: string[];

  @Prop({ type: Number, required: true })
  ranks: number;

  @Prop({ type: Number, required: false })
  maxRanksPerSkill?: number;

  @Prop({ type: String, required: false })
  region?: CultureRegion;
}

/** Entry of the old `fixedSkillRanks` field. Only read, until the 2026-10-20 migration has run. */
@Schema({ _id: false })
export class LegacyCultureFixedSkillRankModel {
  @Prop({ type: String, required: true })
  skillId: string;

  @Prop({ type: String, required: false })
  specialization: string | null;

  @Prop({ type: Number, required: true })
  ranks: number;
}
