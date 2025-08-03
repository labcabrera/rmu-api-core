import { injectable } from 'inversify';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';
import { ArmorType } from '@domain/entities/armor-type';
import { ARMOR_TYPES } from '@shared/constants/armor-types';

@injectable()
export class InMemoryArmorTypeRepository implements ArmorTypeRepository {
  private armorTypes: ArmorType[] = [...ARMOR_TYPES];

  async findById(id: number): Promise<ArmorType | null> {
    const armorType = this.armorTypes.find(at => at.id === id);
    return armorType || null;
  }

  async findAll(): Promise<ArmorType[]> {
    return [...this.armorTypes];
  }

  async create(armorType: ArmorType): Promise<ArmorType> {
    // Generate new ID
    const maxId = Math.max(...this.armorTypes.map(at => at.id), 0);
    const newArmorType = { ...armorType, id: maxId + 1 };
    
    this.armorTypes.push(newArmorType);
    return newArmorType;
  }

  async update(id: number, armorTypeUpdate: Partial<ArmorType>): Promise<ArmorType | null> {
    const index = this.armorTypes.findIndex(at => at.id === id);
    if (index === -1) {
      return null;
    }

    this.armorTypes[index] = { ...this.armorTypes[index], ...armorTypeUpdate };
    return this.armorTypes[index];
  }

  async deleteById(id: number): Promise<boolean> {
    const index = this.armorTypes.findIndex(at => at.id === id);
    if (index === -1) {
      return false;
    }

    this.armorTypes.splice(index, 1);
    return true;
  }
}
