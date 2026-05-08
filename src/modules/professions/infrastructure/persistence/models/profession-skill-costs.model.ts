import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProfessionSkillCosts {
  @Prop({ required: true })
  animal: number[];

  @Prop({ required: true })
  awareness: number[];

  @Prop({ required: true })
  'battle-expertise': number[];

  @Prop({ required: true })
  'body-discipline': number[];

  @Prop({ required: true })
  brawn: number[];

  @Prop({ required: true })
  'combat-expertise': number[];

  @Prop({ required: true })
  combat1: number[];

  @Prop({ required: true })
  combat2: number[];

  @Prop({ required: true })
  combat3: number[];

  @Prop({ required: true })
  combat4: number[];

  @Prop({ required: true })
  composition: number[];

  @Prop({ required: true })
  crafting: number[];

  @Prop({ required: true })
  delving: number[];

  @Prop({ required: true })
  environmental: number[];

  @Prop({ required: true })
  gymnastic: number[];

  @Prop({ required: true })
  lore: number[];

  @Prop({ required: true })
  'magical-expertise': number[];

  @Prop({ required: true })
  medical: number[];

  @Prop({ required: true })
  'mental-discipline': number[];

  @Prop({ required: true })
  movement: number[];

  @Prop({ required: true })
  'performance-art': number[];

  @Prop({ required: true })
  'power-manipulation': number[];

  @Prop({ required: true })
  science: number[];

  @Prop({ required: true })
  social: number[];

  @Prop({ required: true })
  'spells-base-open': number[];

  @Prop({ required: true })
  'spells-ritual-magic': number[];

  @Prop({ required: true })
  'spells-closed': number[];

  @Prop({ required: true })
  'spells-arcane': number[];

  @Prop({ required: true })
  'spells-restricted': number[];

  @Prop({ required: true })
  subterfuge: number[];

  @Prop({ required: true })
  technical: number[];

  @Prop({ required: true })
  vocation: number[];
}
