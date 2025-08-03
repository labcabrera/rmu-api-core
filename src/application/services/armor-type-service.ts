import { injectable, inject } from 'inversify';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';
import { ArmorType } from '@domain/entities/armor-type';
import { NotFoundError } from '@shared/errors';
import { Page } from '@domain/entities/page';
import { TYPES } from '@shared/container';

@injectable()
export class ArmorTypeService {
  constructor(
    @inject(TYPES.ArmorTypeRepository) private armorTypeRepository: ArmorTypeRepository
  ) {}

  async findById(id: number): Promise<ArmorType> {
    const armorType = await this.armorTypeRepository.findById(id);
    if (!armorType) {
      throw new NotFoundError(`Armor type with id ${id} not found`);
    }
    return armorType;
  }

  async find(): Promise<Page<ArmorType>> {
    return await this.armorTypeRepository.find();
  }
}
