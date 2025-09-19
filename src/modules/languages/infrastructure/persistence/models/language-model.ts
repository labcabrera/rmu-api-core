import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Language } from 'src/modules/languages/domain/aggregates/language';

export type LanguageDocument = Language & Document;

@Schema({ collection: 'languages', versionKey: false })
export class LanguageModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const LanguageSchema = SchemaFactory.createForClass(LanguageModel);
