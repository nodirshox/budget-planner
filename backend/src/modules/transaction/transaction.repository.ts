import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { TransactionType } from '@prisma/client'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(
    body: CreateTransactionDto,
    type: TransactionType,
    walletAmount: number,
  ) {
    const wallet = this.prisma.wallet.update({
      where: { id: body.walletId },
      data: { amount: walletAmount },
    })

    const transaction = this.prisma.transaction.create({
      data: {
        amount: body.amount,
        type,
        date: new Date(body.date),
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

    const result = await this.prisma.$transaction([wallet, transaction])

    return result[result.length - 1]
  }

  async filterTransactions(body: FindTransactionsDto) {
    return this.prisma.transaction.findMany({
      where: {
        walletId: body.walletId,
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        amount: true,
        type: true,
        date: true,
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
