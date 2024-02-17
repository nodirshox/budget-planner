import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CategoryService } from '@/modules/category/category.service'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'

@ApiBearerAuth()
@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories' })
  async getCategories() {
    return this.service.getCategories()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category' })
  async getCategory(@Param('id') id: string) {
    return this.service.getCategory(id)
  }
}
