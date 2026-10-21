import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/security/jwt-auth.guard';
import { ENUMERATION_CATEGORIES } from '../../domain/value-objects/enumeration-category.vo';

@UseGuards(JwtAuthGuard)
@Controller('v1/enumeration-categories')
@ApiTags('Enumeration categories')
export class EnumerationCategoryController {
  @Get('')
  @ApiOperation({ operationId: 'findEnumerationCategories', summary: 'Find enumeration categories' })
  @ApiOkResponse({ type: [String] })
  find(): string[] {
    return [...ENUMERATION_CATEGORIES];
  }
}
