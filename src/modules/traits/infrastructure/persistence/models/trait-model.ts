import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Trait } from 'src/modules/traits/domain/aggregates/trait';

export type TraitDocument = Trait & Document;

@Schema({ collection: 'traits', _id: false, versionKey: false })
export class TraitModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ type: Number, required: false })
  cost?: number;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const TraitSchema = SchemaFactory.createForClass(TraitModel);
