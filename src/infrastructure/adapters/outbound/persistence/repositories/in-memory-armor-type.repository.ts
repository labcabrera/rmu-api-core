import { injectable } from 'inversify';
import { ArmorTypeRepository } from '@application/ports/outbound/armor-type-repository';
import { ARMOR_TYPES, ArmorType } from '@domain/entities/armor-type';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemoryArmorTypeRepository implements ArmorTypeRepository {
  async findById(id: number): Promise<ArmorType | null> {
    const armorType = ARMOR_TYPES.find(at => at.id === id);
    return armorType || null;
  }

  async find(): Promise<Page<ArmorType>> {
    return {
      content: ARMOR_TYPES,
      pagination: {
        size: ARMOR_TYPES.length,
        page: 0,
        totalElements: ARMOR_TYPES.length,
        totalPages: 1,
      },
    };
  }
}
