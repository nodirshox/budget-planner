import { BadRequestException, Injectable } from '@nestjs/common'
import { CategoryRepository } from '@/modules/category/category.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { TransactionType } from '@prisma/client'

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async getCategories() {
    return {
      expence: await this.repository.getCategoriesByType(
        TransactionType.EXPENSE,
      ),
      income: await this.repository.getCategoriesByType(TransactionType.INCOME),
    }
  }

  async getCategory(id: string) {
    const category = await this.repository.getCategory(id)

    if (!category) {
      throw new BadRequestException(HTTP_MESSAGES.CATEGORY_NOT_FOUND)
    }

    return category
  }
}
