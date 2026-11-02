import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { AlchemyFailureRow, AlchemyFailureTable, PowerLevel } from '../../../domain/value-objects/alchemy-tables.vo.js';

export type AlchemyTablesDocument = HydratedDocument<AlchemyTablesModel>;

/**
 * Same shape as AlchemyTables, with `alchemy` as _id. Imported with data/scripts/import-alchemy-tables.js, which
 * bumps the version when the tables change.
 */
@Schema({ collection: 'alchemy-tables', id: true, versionKey: false })
export class AlchemyTablesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Object, required: true })
  failureTables: Partial<Record<AlchemyFailureTable, AlchemyFailureRow[]>>;

  @Prop({ type: Object, required: true })
  powerLevels: Record<PowerLevel, number>;

  @Prop({ type: Number, default: 0 })
  version: number;
}

export const AlchemyTablesSchema = SchemaFactory.createForClass(AlchemyTablesModel);
