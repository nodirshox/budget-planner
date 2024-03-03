import { BadRequestException, Injectable } from '@nestjs/common'
import { CategoryRepository } from '@/modules/category/category.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { TransactionType } from '@prisma/client'
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto'
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async createCategory(userId: string, body: CreateCategoryDto) {
    return this.repository.createCategory(userId, body)
  }

  async updateCategory(userId: string, id: string, body: UpdateCategoryDto) {
    await this.getCategory(userId, id)

    return this.repository.updateCategory(id, body)
  }

  async getCategories(userId: string) {
    return {
      expense: await this.repository.getCategoriesByType(
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

    return {
      ...category,
      transactionsCount: await this.repository.countCategoryTransactions(id),
    }
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

  async deleteCategory(userId: string, id: string) {
    const category = await this.getCategory(userId, id)

    if (category.transactionsCount > 0) {
      throw new BadRequestException(HTTP_MESSAGES.CAN_NOT_DELETE_CATEGORY)
    }

    return this.repository.deleteCategory(id)
  }
}
