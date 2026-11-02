import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { HealingTablesRepository } from '../../application/ports/healing-tables-repository.port.js';
import type { HealingTables, TreatmentLimits } from '../../domain/value-objects/healing-tables.vo.js';
import { type HealingTablesDocument, HealingTablesModel } from '../persistence/models/healing-tables.model.js';

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
      treatmentDifficulties: (doc.treatmentDifficulties || []).map(row => ({
        procedure: row.procedure,
        injuryType: row.injuryType,
        severity: row.severity,
        difficulty: row.difficulty,
      })),
      treatmentRules: {
        headDifficultySteps: doc.treatmentRules?.headDifficultySteps ?? 0,
        cauterizePenaltyPerBleeding: doc.treatmentRules?.cauterizePenaltyPerBleeding ?? 0,
        bleedingProcedures: [...(doc.treatmentRules?.bleedingProcedures || [])],
        tourniquetLocations: [...(doc.treatmentRules?.tourniquetLocations || [])],
      },
      treatmentDurations: (doc.treatmentDurations || []).map(row => ({
        procedure: row.procedure,
        rounds: row.rounds ?? null,
        perBleeding: row.perBleeding === true,
      })),
      cauterization: (doc.cauterization || []).map(row => ({
        min: row.min ?? null,
        max: row.max ?? null,
        result: row.result,
        bleeding: row.bleeding,
        heatSeverity: row.heatSeverity ?? null,
        hitsDice: row.hitsDice ?? 0,
      })),
      cauterizationUnusualRoll: doc.cauterizationUnusualRoll ?? null,
      surgeryRequired: (doc.surgeryRequired || []).map(row => ({ injuryType: row.injuryType, severity: row.severity })),
      treatmentLimits: MongoHealingTablesRepository.mapLimits(doc.treatmentLimits),
      tourniquet: doc.tourniquet ? { ...doc.tourniquet } : null,
      stabilize: doc.stabilize ? { ...doc.stabilize } : null,
      salveModifier: doc.salveModifier ? { ...doc.salveModifier } : null,
      combatItemAp: doc.combatItemAp ?? null,
    };
  }

  /** Limits are only returned whole: a document without both procedures has none. */
  private static mapLimits(limits: TreatmentLimits | null | undefined): TreatmentLimits | null {
    if (!limits?.splint?.leg || !limits.splint.arm || !limits.cast?.leg) return null;
    return {
      splint: { leg: { pace: limits.splint.leg.pace }, arm: { limbUnusable: limits.splint.arm.limbUnusable === true } },
      cast: {
        leg: { pace: limits.cast.leg.pace, cane: limits.cast.leg.cane, crutches: limits.cast.leg.crutches },
        maneuverPenaltyFactor: limits.cast.maneuverPenaltyFactor ?? 1,
      },
    };
  }
}
