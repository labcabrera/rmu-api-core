import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import * as armorTypeRepository from '../../application/ports/outbound/armor-type-repository';

@UseGuards(JwtAuthGuard)
@Controller('v1/armor-types')
@ApiTags('Armor Types')
export class ArmorTypeController {
  constructor(@Inject('ArmorTypeRepository') private readonly armorTypeRepository: armorTypeRepository.ArmorTypeRepository) {}

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.armorTypeRepository.findById(id);
  }

  @Get('')
  find() {
    return this.armorTypeRepository.find();
  }
}
