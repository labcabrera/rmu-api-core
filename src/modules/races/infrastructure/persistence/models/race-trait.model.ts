import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RaceTrait {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  traitId: string;

  @Prop({ type: String, required: false })
  modifier: string | undefined;

  @Prop({ type: String, required: false })
  description: string;
}
