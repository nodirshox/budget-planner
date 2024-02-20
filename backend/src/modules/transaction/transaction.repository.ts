import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { TransactionType } from '@prisma/client'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'
import { UtilsService } from '@/core/utils/utils.service'

@Injectable()
export class TransactionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async createTransaction(body: CreateTransactionDto, type: TransactionType) {
    const updateWallet = this.prisma.wallet.update({
      where: { id: body.walletId },
      data: {
        amount: {
          increment: this.utils.calculateWalletAmount(type, body.amount),
        },
      },
    })

    const transaction = this.prisma.transaction.create({
      data: {
        amount: body.amount,
        type,
        date: new Date(body.date),
        notes: body.notes,
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

    const result = await this.prisma.$transaction([updateWallet, transaction])

    return result[result.length - 1]
  }

  async filterTransactions(body: FindTransactionsDto) {
    const { currentMonth, nextMonth } = this.utils.getMonths(
      new Date(body.month),
    )
    return this.prisma.transaction.findMany({
      where: {
        walletId: body.walletId,
        date: {
          gte: currentMonth,
          lt: nextMonth,
        },
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        amount: true,
        type: true,
        date: true,
        notes: true,
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
