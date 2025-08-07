import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RaceStatBonus {
  @Prop({ required: true })
  ag: number;

  @Prop({ required: true })
  co: number;

  @Prop({ required: true })
  em: number;

  @Prop({ required: true })
  in: number;

  @Prop({ required: true })
  me: number;

  @Prop({ required: true })
  pr: number;

  @Prop({ required: true })
  qu: number;

  @Prop({ required: true })
  re: number;

  @Prop({ required: true })
  sd: number;

  @Prop({ required: true })
  st: number;
}

export const RaceStatBonusSchema = SchemaFactory.createForClass(RaceStatBonus);
