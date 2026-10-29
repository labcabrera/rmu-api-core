import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { NegotiationRow, PriceFactor } from '../../../domain/value-objects/trading-tables.vo.js';

export type TradingTablesDocument = HydratedDocument<TradingTablesModel>;

/** Same shape as TradingTables, with the rulebook as _id. Imported with data/scripts/import-trading-tables.js. */
@Schema({ collection: 'trading-tables', id: true, versionKey: false })
export class TradingTablesModel {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: [Object], required: true })
  negotiation: NegotiationRow[];

  @Prop({ type: [Object], required: true })
  priceFactors: PriceFactor[];
}

export const TradingTablesSchema = SchemaFactory.createForClass(TradingTablesModel);
