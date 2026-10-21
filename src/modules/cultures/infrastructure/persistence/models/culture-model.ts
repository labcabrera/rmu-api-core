import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { CultureSkillRankModel, LegacyCultureFixedSkillRankModel } from './culture-skill-rank.model.js';

export type CultureDocument = CultureModel & Document;

@Schema({ collection: 'cultures', _id: false, versionKey: false })
export class CultureModel {
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
