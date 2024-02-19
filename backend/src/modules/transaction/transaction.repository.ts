import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { TransactionType } from '@prisma/client'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(body: CreateTransactionDto, type: TransactionType) {
    const updateWallet = this.prisma.wallet.update({
      where: { id: body.walletId },
      data: {
        amount: {
          increment: this.calculateWalletAmount(type, body.amount),
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
    return this.prisma.transaction.findMany({
      where: {
        walletId: body.walletId,
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

  calculateWalletAmount(type: TransactionType, amount: number): number {
    let finalAmount = 0
    switch (type) {
      case TransactionType.EXPENSE: {
        finalAmount -= amount
        break
      }
      case TransactionType.INCOME: {
        finalAmount += amount
        break
      }
      default: {
        throw new Error('Transaction type not found')
      }
    }

    return Number(finalAmount.toFixed(2))
  }
}
