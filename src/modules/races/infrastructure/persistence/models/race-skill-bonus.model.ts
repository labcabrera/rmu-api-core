import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RaceSkillBonus {
  @Prop({ type: String, required: true })
  skillId: string;

  @Prop({ type: String, required: false })
  specialization: string | null;

  @Prop({ type: Number, required: true })
  bonus: number;
}
