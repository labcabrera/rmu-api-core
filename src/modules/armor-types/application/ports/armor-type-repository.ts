import { ArmorType } from '../../domain/entities/armor-type';

export interface ArmorTypeRepository {
  findById(id: number): ArmorType | null;
  find(): ArmorType[];
}
