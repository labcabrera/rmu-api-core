import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Race } from 'src/modules/core/domain/entities/race';

export type RaceDocument = Race & Document;

@Schema({ collection: 'races', versionKey: false })
export class RaceModel {
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

export const RaceSchema = SchemaFactory.createForClass(RaceModel);
