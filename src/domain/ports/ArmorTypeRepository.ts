import { ArmorType } from '@domain/entities/ArmorType';

export interface ArmorTypeRepository {
  findById(id: number): Promise<ArmorType | null>;
  findAll(): Promise<ArmorType[]>;
  create(armorType: ArmorType): Promise<ArmorType>;
  update(id: number, armorType: Partial<ArmorType>): Promise<ArmorType | null>;
  deleteById(id: number): Promise<boolean>;
}
