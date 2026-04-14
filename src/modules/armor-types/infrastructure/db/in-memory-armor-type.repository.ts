import { Injectable } from '@nestjs/common';
import { ArmorTypeRepository } from '../../application/ports/armor-type-repository';
import { ArmorType, ARMOR_TYPES } from '../../domain/entities/armor-type';

@Injectable()
export class InMemoryArmorTypeRepository implements ArmorTypeRepository {
  findById(id: number): ArmorType | null {
    const armorType = ARMOR_TYPES.find(at => at.id === id);
    return armorType || null;
  }

  find(): ArmorType[] {
    return ARMOR_TYPES;
  }
}
