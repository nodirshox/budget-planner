import { Module } from '@nestjs/common'
import { CategoryController } from '@category/category.controller'
import { CategoryService } from '@category/category.service'
import { CategoryRepository } from '@category/category.repository'
import { CoreModule } from '@core/core.module'

@Module({
  imports: [CoreModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
