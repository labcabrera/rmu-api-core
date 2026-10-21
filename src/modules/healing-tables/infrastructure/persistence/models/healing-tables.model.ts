import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type {
  HealingType,
  InjurySeverity,
  PermanentInjuryRow,
  RecoveryDaysRow,
  SeverityThreshold,
} from 'src/modules/healing-tables/domain/value-objects/healing-tables.vo';

export type HealingTablesDocument = HealingTablesModel & Document;

/** Same shape as HealingTables, with the rulebook as _id. Imported with data/scripts/import-healing-tables.js. */
@Schema({ collection: 'healing-tables', id: true, versionKey: false })
export class HealingTablesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  recoveryDays: RecoveryDaysRow[];

  @Prop({ type: Object, required: true })
  severityMultipliers: Record<InjurySeverity, number>;

  @Prop({ type: Number, required: true })
  headMultiplier: number;

  @Prop({ type: [Object], required: true })
  severity: SeverityThreshold[];

  @Prop({ type: Object, required: true })
  healingTypeModifiers: Record<HealingType, number>;

  @Prop({ type: Number, required: true })
  herbalismBonus: number;

  @Prop({ type: [Object], required: true })
  permanentInjury: PermanentInjuryRow[];

  @Prop({ type: Number, required: true })
  restHpPercentPerPeriod: number;

  @Prop({ type: Number, required: true })
  restPeriodHours: number;

  @Prop({ type: Number, required: true })
  fullRestDayMultiplier: number;

  @Prop({ type: Object, required: true })
  talentMultipliers: Record<string, number>;
}

export const HealingTablesSchema = SchemaFactory.createForClass(HealingTablesModel);
