import { Injectable } from '@nestjs/common';
import { ArmorTypeRepository } from 'src/modules/core/application/ports/outbound/armor-type-repository';
import { ArmorType, ARMOR_TYPES } from 'src/modules/core/domain/entities/armor-type';
import { Page } from 'src/modules/core/domain/entities/page';

@Injectable()
export class InMemoryArmorTypeRepository implements ArmorTypeRepository {
  findById(id: number): ArmorType | null {
    const armorType = ARMOR_TYPES.find((at) => at.id === id);
    return armorType || null;
  }

  find(): Page<ArmorType> {
    return new Page<ArmorType>(ARMOR_TYPES, 0, ARMOR_TYPES.length, ARMOR_TYPES.length);
  }
}
