import { BadRequestException, Injectable } from '@nestjs/common'
import { CategoryRepository } from '@/modules/category/category.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { TransactionType } from '@prisma/client'

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getCategories(userId: string) {
    return {
      expence: await this.repository.getCategoriesByType(
        userId,
        TransactionType.EXPENSE,
      ),
      income: await this.repository.getCategoriesByType(
        userId,
        TransactionType.INCOME,
      ),
    }
  }

  async getCategory(userId: string, id: string) {
    const category = await this.repository.getCategory(id)

    if (!category) {
      throw new BadRequestException(HTTP_MESSAGES.CATEGORY_NOT_FOUND)
    }

    if (category.userId !== userId) {
      throw new BadRequestException(HTTP_MESSAGES.CATEGORY_NOT_BELONGS_TO_USER)
    }

    return category
  }

  async findCategoryByName(
    userId: string,
    name: string,
    type: TransactionType,
  ) {
    const categories = await this.repository.findCategoryByName(
      userId,
      name,
      type,
    )

    if (categories.length === 0) {
      throw new Error(`Category not found: ${name}, ${type}`)
    }

    return categories[0]
  }
}
