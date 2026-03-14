import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Realm } from 'src/modules/realms/domain/aggregates/realm';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';

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
