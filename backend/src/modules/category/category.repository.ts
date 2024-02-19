import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { TransactionType } from '@prisma/client'

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoriesByType(userId: string, type: TransactionType) {
    return this.prisma.category.findMany({
      where: { userId, type },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  async getCategory(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    })
  }

  async findCategoryByName(
    userId: string,
    name: string,
    type: TransactionType,
  ) {
    return this.prisma.category.findMany({
      where: { userId, name, type },
    })
  }
}
