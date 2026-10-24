import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export type RealmDocument = HydratedDocument<RealmModel>;

@Schema({ collection: 'realms', versionKey: false })
export class RealmModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  magicPresence: MagicPresence;

  @Prop({ required: false })
  shortDescription?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: String, required: false })
  imageUrl: string | undefined;

  @Prop({ required: true })
  owner: string;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const RealmSchema = SchemaFactory.createForClass(RealmModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
RealmSchema.index({ owner: 1 });
RealmSchema.index({ accessType: 1 });
