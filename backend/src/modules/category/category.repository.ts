import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { TransactionType } from '@prisma/client'
import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto'
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto'

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(userId: string, body: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: body.name,
        type: body.type,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async updateCategory(id: string, body: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: body.name,
      },
    })
  }

  async getCategoriesByType(userId: string, type: TransactionType) {
    return this.prisma.category.findMany({
      where: { userId, type },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async getCategory(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    })
  }

  async countCategoryTransactions(id: string): Promise<number> {
    const result = await this.prisma.category.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    })

    return result._count.transactions
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

  async deleteCategory(id: string) {
    return this.prisma.category.delete({
      where: { id },
    })
  }
}
