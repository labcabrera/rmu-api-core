import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import type {
  ManeuverModifierOption,
  ManeuverModifierScope,
  ManeuverModifierType,
} from '../../../domain/value-objects/maneuver-modifier-type.vo.js';

export type ManeuverModifierDocument = HydratedDocument<ManeuverModifierModel>;

@Schema({ collection: 'maneuver-modifiers', id: true, versionKey: false })
export class ManeuverModifierModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true, unique: true })
  key: string;

  @Prop({ type: Object, required: true })
  scope: ManeuverModifierScope;

  @Prop({ type: String, required: true })
  type: ManeuverModifierType;

  @Prop({ type: Number, required: false })
  value?: number;

  @Prop({ type: [Object], required: false, default: undefined })
  options?: ManeuverModifierOption[];

  @Prop({ type: Number, required: false })
  perUnit?: number;

  @Prop({ type: Number, required: false })
  min?: number;

  @Prop({ type: Number, required: false })
  max?: number;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const ManeuverModifierSchema = SchemaFactory.createForClass(ManeuverModifierModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
ManeuverModifierSchema.index({ owner: 1 });
ManeuverModifierSchema.index({ accessType: 1 });
ManeuverModifierSchema.index({ 'scope.skillIds': 1 });
ManeuverModifierSchema.index({ 'scope.categoryIds': 1 });
