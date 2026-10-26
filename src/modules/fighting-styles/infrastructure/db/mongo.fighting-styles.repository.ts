import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { FightingStylesRepository } from '../../application/ports/fighting-styles-repository.port.js';
import type { FightingStyleCatalog, StyleEquipment } from '../../domain/value-objects/fighting-styles.vo.js';
import { type FightingStylesDocument, FightingStylesModel } from '../persistence/models/fighting-styles.model.js';

@Injectable()
export class MongoFightingStylesRepository implements FightingStylesRepository {
  constructor(@InjectModel(FightingStylesModel.name) private readonly model: Model<FightingStylesDocument>) {}

  async findById(id: string): Promise<FightingStyleCatalog | null> {
    const doc = await this.model.findById(id).lean<FightingStylesModel>();
    return doc ? MongoFightingStylesRepository.mapToCatalog(doc) : null;
  }

  static mapToCatalog(doc: FightingStylesModel): FightingStyleCatalog {
    const equipment = (value: StyleEquipment | undefined): StyleEquipment =>
      (value || []).map(alternative => alternative.map(condition => ({ ...condition })));
    return {
      styles: (doc.styles || []).map(style => ({
        id: style.id,
        skillId: style.skillId,
        abilities: (style.abilities || []).map(ability => ({ abilityId: ability.abilityId, cost: ability.cost })),
        requiresSkills: [...(style.requiresSkills || [])],
        requiresTraits: [...(style.requiresTraits || [])],
        equipment: equipment(style.equipment),
      })),
      abilities: (doc.abilities || []).map(ability => ({
        id: ability.id,
        types: [...(ability.types || [])],
        repeatable: !!ability.repeatable,
        maxTimes: ability.maxTimes ?? null,
        requiresAbilities: [...(ability.requiresAbilities || [])],
        requiresSkills: [...(ability.requiresSkills || [])],
        requiresTraits: [...(ability.requiresTraits || [])],
        equipment: equipment(ability.equipment),
      })),
    };
  }
}
