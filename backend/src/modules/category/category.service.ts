import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '@/modules/category/category.repository'

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getCategories() {
    return { categories: await this.repository.getCategories() }
  }
}
