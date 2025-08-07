import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
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
  findById(@Param('id') id: string) {
    return this.characterSizeRepository.findById(id);
  }

  @Get('')
  find() {
    return this.characterSizeRepository.find();
  }
}
