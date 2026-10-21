import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealingTablesRepository } from '../../application/ports/healing-tables-repository';
import { HealingTables } from '../../domain/value-objects/healing-tables.vo';
import { HealingTablesDocument, HealingTablesModel } from '../persistence/models/healing-tables.model';

@Injectable()
export class MongoHealingTablesRepository implements HealingTablesRepository {
  constructor(@InjectModel(HealingTablesModel.name) private readonly model: Model<HealingTablesDocument>) {}

  async findById(id: string): Promise<HealingTables | null> {
    const doc = await this.model.findById(id).lean<HealingTablesModel>();
    return doc ? MongoHealingTablesRepository.mapToTables(doc) : null;
  }

  static mapToTables(doc: HealingTablesModel): HealingTables {
    return {
      recoveryDays: (doc.recoveryDays || []).map(row => ({ min: row.min ?? null, max: row.max ?? null, days: { ...row.days } })),
      severityMultipliers: { ...doc.severityMultipliers },
      headMultiplier: doc.headMultiplier,
      severity: (doc.severity || []).map(row => ({
        severity: row.severity,
        maxPenalty: row.maxPenalty ?? null,
        maxBleeding: row.maxBleeding ?? null,
      })),
      healingTypeModifiers: { ...doc.healingTypeModifiers },
      herbalismBonus: doc.herbalismBonus,
      permanentInjury: (doc.permanentInjury || []).map(row => ({
        min: row.min ?? null,
        max: row.max ?? null,
        result: row.result,
        fraction: row.fraction,
      })),
      restHpPercentPerPeriod: doc.restHpPercentPerPeriod,
      restPeriodHours: doc.restPeriodHours,
      fullRestDayMultiplier: doc.fullRestDayMultiplier,
      talentMultipliers: { ...(doc.talentMultipliers || {}) },
    };
  }
}
