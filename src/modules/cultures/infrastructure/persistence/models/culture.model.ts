import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { CultureSkillRankModel, LegacyCultureFixedSkillRankModel } from './culture-skill-rank.model.js';

export type CultureDocument = HydratedDocument<CultureModel>;

@Schema({ collection: 'cultures', _id: false, versionKey: false })
export class CultureModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: false })
  description: string | null;

  @Prop({ type: String, required: false })
  imageUrl: string | null;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: false })
  updatedAt: Date | null;

  @Prop({ type: [CultureSkillRankModel], required: false, default: undefined })
  skillRanks?: CultureSkillRankModel[];

  @Prop({ type: [String], required: false, default: undefined })
  languages?: string[];

  @Prop({ type: String, required: false })
  suggestedCrafts?: string;

  @Prop({ type: String, required: false })
  suggestedVocations?: string;

  /** Old format, read only when `skillRanks` is absent. Never written. */
  @Prop({ type: [LegacyCultureFixedSkillRankModel], required: false, default: undefined })
  fixedSkillRanks?: LegacyCultureFixedSkillRankModel[];
}

export const CultureSchema = SchemaFactory.createForClass(CultureModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
CultureSchema.index({ owner: 1 });
CultureSchema.index({ accessType: 1 });
CultureSchema.index({ name: 1 });
