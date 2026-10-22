import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Realm } from '../../../domain/aggregates/realm.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';

export type RealmDocument = Realm & Document;

@Schema({ collection: 'realms', versionKey: false })
export class RealmModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  magicPresence: string;

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
