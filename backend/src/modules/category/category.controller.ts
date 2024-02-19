import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CategoryService } from '@/modules/category/category.service'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@/modules/users/dto/user.interface'

@ApiBearerAuth()
@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories' })
  async getCategories(@User() user: IUser) {
    return this.service.getCategories(user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category' })
  async getCategory(@User() user: IUser, @Param('id') id: string) {
    return this.service.getCategory(user.id, id)
  }
}
