import { ArmorType } from 'src/modules/core/domain/entities/armor-type';
import { Page } from 'src/modules/core/domain/entities/page';

export interface ArmorTypeRepository {
  findById(id: number): ArmorType | null;
  find(): Page<ArmorType>;
}
