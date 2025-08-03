import { ArmorType } from '@domain/entities/armor-type';
import { Page } from '@domain/entities/page';

export interface ArmorTypeRepository {
  findById(id: number): Promise<ArmorType | null>;
  find(): Promise<Page<ArmorType>>;
}
