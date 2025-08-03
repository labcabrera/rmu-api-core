import { ArmorType } from '@domain/entities/armor-type';

export interface ArmorTypeRepository {
  findById(id: number): Promise<ArmorType | null>;
  findAll(): Promise<ArmorType[]>;
}
