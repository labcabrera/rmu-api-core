import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import * as characterSizeRepository from '../../application/ports/outbound/character-size-repository';

@UseGuards(JwtAuthGuard)
@Controller('v1/character-sizes')
@ApiTags('Character Sizes')
export class CharacterSizeController {
  constructor(
    @Inject('CharacterSizeRepository') private readonly characterSizeRepository: characterSizeRepository.CharacterSizeRepository,
  ) {}

  @Get(':id')
  @ApiOperation({ operationId: 'findCharacterSizeById', summary: 'Find character size by id' })
  findById(@Param('id') id: string) {
    return this.characterSizeRepository.findById(id);
  }

  @Get('')
  @ApiOperation({ operationId: 'findCharacterSizes', summary: 'Find all character sizes' })
  find() {
    return this.characterSizeRepository.find();
  }
}
