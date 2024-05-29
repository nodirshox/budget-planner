import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CategoryService } from '@category/category.service'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@users/dto/user.interface'
import { CreateCategoryDto } from '@category/dto/create-category.dto'
import { UpdateCategoryDto } from '@category/dto/update-category.dto'

@ApiBearerAuth()
@ApiTags('Category')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async createCategory(@Body() body: CreateCategoryDto, @User() user: IUser) {
    return this.service.createCategory(user.id, body)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  async updateCategory(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.service.updateCategory(user.id, id, body)
  }

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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@User() user: IUser, @Param('id') id: string) {
    return this.service.deleteCategory(user.id, id)
  }
}
