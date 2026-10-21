import type { ArmorType } from '../../domain/entities/armor-type.js';

export interface ArmorTypeRepository {
  findById(id: number): ArmorType | null;
  find(): ArmorType[];
}
