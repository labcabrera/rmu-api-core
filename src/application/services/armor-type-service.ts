import { injectable, inject } from 'inversify';
import { TYPES } from '@shared/types/container';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';
import { ArmorType } from '@domain/entities/armor-type';
import { NotFoundError } from '@shared/errors';

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

  async findAll(): Promise<ArmorType[]> {
    return await this.armorTypeRepository.findAll();
  }

  


}
