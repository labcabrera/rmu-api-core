import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard.js';
import { ArmorTypeDto } from './dto/armor-type.dto.js';
import { NotFoundError } from '../../../shared/domain/errors/errors.js';
import { ARMOR_TYPE_REPOSITORY, type ArmorTypeRepository } from '../../application/ports/armor-type-repository.port.js';

@UseGuards(JwtAuthGuard)
@Controller('v1/armor-types')
@ApiTags('Armor Types')
export class ArmorTypeController {
  constructor(@Inject(ARMOR_TYPE_REPOSITORY) private readonly armorTypeRepository: ArmorTypeRepository) {}

  @Get(':id')
  @ApiOkResponse({ type: ArmorTypeDto })
  @ApiOperation({ operationId: 'findArmorTypeById', summary: 'Find armor type by id' })
  findById(@Param('id') id: number) {
    const entity = this.armorTypeRepository.findById(id);
    if (!entity) {
      throw new NotFoundError('Armor type', id);
    }
    return ArmorTypeDto.fromEntity(entity);
  }

  @Get('')
  @ApiOperation({ operationId: 'findAllArmorTypes', summary: 'Find all armor types' })
  @ApiOkResponse({ type: [ArmorTypeDto] })
  find() {
    const list = this.armorTypeRepository.find();
    return list.map(e => ArmorTypeDto.fromEntity(e));
  }
}
