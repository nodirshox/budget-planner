import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { TransactionType } from '@prisma/client'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(body: CreateTransactionDto, type: TransactionType) {
    return this.prisma.transaction.create({
      data: {
        amount: body.amount,
        type,
        wallet: {
          connect: {
            id: body.walletId,
          },
        },
        category: {
          connect: {
            id: body.categoryId,
          },
        },
      },
      include: {
        category: true,
      },
    })
  }

  async filterTransactions(body: FindTransactionsDto) {
    return this.prisma.transaction.findMany({
      where: {
        walletId: body.walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }
}
