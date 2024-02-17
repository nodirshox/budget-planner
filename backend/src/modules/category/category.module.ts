import { Module } from '@nestjs/common'
import { CategoryController } from '@/modules/category/category.controller'
import { CategoryService } from '@/modules/category/category.service'
import { CategoryRepository } from '@/modules/category/category.repository'
import { CoreModule } from '@/core/core.module'

@Module({
  imports: [CoreModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
