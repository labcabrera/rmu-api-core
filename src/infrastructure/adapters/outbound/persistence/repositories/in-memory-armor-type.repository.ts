import { injectable } from 'inversify';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';
import { ArmorType } from '@domain/entities/armor-type';
import { ARMOR_TYPES } from '@shared/constants/armor-types';
import { Page } from '@domain/entities/page';

@injectable()
export class InMemoryArmorTypeRepository implements ArmorTypeRepository {
  private armorTypes: ArmorType[] = [...ARMOR_TYPES];

  async findById(id: number): Promise<ArmorType | null> {
    const armorType = this.armorTypes.find(at => at.id === id);
    return armorType || null;
  }

  async find(): Promise<Page<ArmorType>> {
    return {
      content: this.armorTypes,
      pagination: {
        size: this.armorTypes.length,
        page: 0,
        totalElements: this.armorTypes.length,
        totalPages: 1,
      }
    }
  }

}
