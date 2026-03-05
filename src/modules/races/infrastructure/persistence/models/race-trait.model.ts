import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RaceTrait {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  traitId: string;

  @Prop({ type: String, required: false })
  specialization: string | undefined;

  @Prop({ type: Boolean, required: true })
  isTalent: boolean;

  @Prop({ type: Number, required: false })
  tier: number | undefined;

  @Prop({ type: String, required: false })
  description: string | undefined;
}
