import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type {
  FallenThreshold,
  FearResultRow,
  FrightLevel,
  MoraleRow,
  MoraleUnusualEvent,
  RallyGroupModifier,
  RallyRow,
  RallyUnusualEvent,
  ResistanceRollRules,
  ResistanceRow,
  RevulsionRules,
} from '../../../domain/value-objects/psychology-tables.vo.js';

export type PsychologyTablesDocument = HydratedDocument<PsychologyTablesModel>;

/** Same shape as PsychologyTables, with the rulebook as _id. Imported with data/scripts/import-psychology-tables.js. */
@Schema({ collection: 'psychology-tables', id: true, versionKey: false })
export class PsychologyTablesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  frightLevels: FrightLevel[];

  @Prop({ type: [Object], required: true })
  frightLevelModifiers: FrightLevel[];

  @Prop({ type: [Object], required: true })
  fearResults: FearResultRow[];

  @Prop({ type: [Object], required: true })
  morale: MoraleRow[];

  @Prop({ type: Object, required: true })
  moraleUnusualEvent: MoraleUnusualEvent;

  @Prop({ type: [Object], required: true })
  rally: RallyRow[];

  @Prop({ type: Object, required: true })
  rallyUnusualEvent: RallyUnusualEvent;

  @Prop({ type: Object, required: true })
  rallyGroupModifier: RallyGroupModifier;

  @Prop({ type: [Object], required: true })
  resistance: ResistanceRow[];

  @Prop({ type: Object, required: true })
  resistanceRoll: ResistanceRollRules;

  // Spec 068: optional, documents imported before do not have them.
  @Prop({ type: [Object], required: false })
  fallenThresholds?: FallenThreshold[];

  @Prop({ type: Object, required: false })
  revulsion?: RevulsionRules | null;
}

export const PsychologyTablesSchema = SchemaFactory.createForClass(PsychologyTablesModel);
