import { injectable, inject } from 'inversify';
import { ArmorTypeRepository } from '@application/ports/outbound/armor-type-repository';
import { ArmorType } from '@domain/entities/armor-type';
import { NotFoundError } from '@domain/errors/errors';
import { Page } from '@domain/entities/page';

@injectable()
export class ArmorTypeService {
  constructor(@inject('ArmorTypeRepository') private armorTypeRepository: ArmorTypeRepository) {}

  async findById(id: number): Promise<ArmorType> {
    const armorType = await this.armorTypeRepository.findById(id);
    if (!armorType) {
      throw new NotFoundError('ArmorType', id);
    }
    return armorType;
  }

  async find(): Promise<Page<ArmorType>> {
    return await this.armorTypeRepository.find();
  }
}
