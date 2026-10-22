import type { ArmorType } from '../../domain/entities/armor-type.js';

export const ARMOR_TYPE_REPOSITORY = Symbol('ArmorTypeRepository');

export interface ArmorTypeRepository {
  findById(id: number): ArmorType | null;
  find(): ArmorType[];
}
