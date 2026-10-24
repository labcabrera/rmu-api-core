import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { EnumerationCategory } from '../../../../enumerations/domain/value-objects/enumeration-category.vo.js';
import type { ManeuverProfile } from '../../../../skill-categories/domain/value-objects/maneuver-profile.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export type SkillDocument = HydratedDocument<SkillModel>;

@Schema({ collection: 'skills', id: true, versionKey: false })
export class SkillModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: [String], required: true })
  bonus: string[];

  @Prop({ type: String, required: false })
  specialization: EnumerationCategory | null;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ type: Object, required: false })
  maneuver?: ManeuverProfile | null;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const SkillSchema = SchemaFactory.createForClass(SkillModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
SkillSchema.index({ owner: 1 });
SkillSchema.index({ accessType: 1 });
SkillSchema.index({ categoryId: 1 });
