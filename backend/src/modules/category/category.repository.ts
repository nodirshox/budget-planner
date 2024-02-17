import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { TransactionType } from '@prisma/client'

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoriesByType(type: TransactionType) {
    return this.prisma.category.findMany({
      where: { type },
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
}
