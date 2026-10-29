import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { TradingTablesRepository } from '../../application/ports/trading-tables-repository.port.js';
import type { NegotiationRow, PriceFactor, TradingTables } from '../../domain/value-objects/trading-tables.vo.js';
import { type TradingTablesDocument, TradingTablesModel } from '../persistence/models/trading-tables.model.js';

const optional = <T extends object>(entries: T): T =>
  Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined && value !== null)) as T;

@Injectable()
export class MongoTradingTablesRepository implements TradingTablesRepository {
  constructor(@InjectModel(TradingTablesModel.name) private readonly model: Model<TradingTablesDocument>) {}

  async findById(id: string): Promise<TradingTables | null> {
    const doc = await this.model.findById(id).lean<TradingTablesModel>();
    return doc ? MongoTradingTablesRepository.mapToTables(doc) : null;
  }

  static mapToTables(doc: TradingTablesModel): TradingTables {
    return {
      negotiation: (doc.negotiation || []).map((row): NegotiationRow => ({
        min: row.min ?? null,
        max: row.max ?? null,
        purchase: row.purchase ?? null,
        sale: row.sale ?? null,
        ...(row.outcome ? { outcome: row.outcome } : {}),
      })),
      priceFactors: (doc.priceFactors || []).map((factor): PriceFactor =>
        optional({
          key: factor.key,
          type: factor.type,
          mode: factor.mode,
          value: factor.value,
          options: factor.options?.map(option => ({ key: option.key, value: option.value })),
          perUnit: factor.perUnit,
          min: factor.min,
          max: factor.max,
          contexts: factor.contexts?.length ? [...factor.contexts] : undefined,
          description: factor.description,
        }),
      ),
    };
  }
}
