import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as race from 'src/modules/core/domain/entities/race';
import { RaceStatBonus } from './race-model-childs';

export type RaceDocument = race.Race & Document;

@Schema({ collection: 'races', versionKey: false })
export class RaceModel {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  realm: string;

  @Prop({ required: true })
  size: string;

  @Prop({ type: RaceStatBonus, required: true })
  defaultStatBonus: race.RaceStatBonus;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const RaceSchema = SchemaFactory.createForClass(RaceModel);
