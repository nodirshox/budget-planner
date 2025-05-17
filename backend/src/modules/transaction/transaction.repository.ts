import { PrismaService } from '@core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@transaction/dto/create-transaction.dto'
import { Prisma, TransactionType } from '@prisma/client'
import { FindTransactionsDto } from '@transaction/dto/find-transactions.dto'
import { UtilsService } from '@core/utils/utils.service'

export type ITransactionWithCategory = Prisma.TransactionGetPayload<{
  select: {
    id: true
    amount: true
    type: true
    date: true
    notes: true
    category: {
      select: {
        id: true
        name: true
      }
    }
  }
}>

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

  async filterTransactions(
    body: FindTransactionsDto,
  ): Promise<ITransactionWithCategory[]> {
    return this.prisma.transaction.findMany({
      where: {
        walletId: body.walletId,
        ...(body.startDate &&
          body.endDate && {
            date: {
              gte: new Date(body.startDate),
              lte: new Date(body.endDate),
            },
          }),
        ...(body.categoryId && {
          categoryId: body.categoryId,
        }),
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

  async getTransaction(id: string) {
    return this.prisma.transaction.findUnique({ where: { id } })
  }

  async updateTranasction(id: string, body: UpdateTransactionDto) {
    const updateWallet = this.prisma.wallet.update({
      where: { id: body.walletId },
      data: {
        amount: {
          increment:
            -1 *
              this.utils.calculateWalletAmount(body.oldType, body.oldAmount) +
            this.utils.calculateWalletAmount(body.type, body.amount),
        },
      },
    })

    const transaction = this.prisma.transaction.update({
      where: { id },
      data: {
        amount: body.amount,
        type: body.type,
        date: new Date(body.date),
        notes: body.notes,
        category: {
          connect: {
            id: body.categoryId,
          },
        },
      },
    })

    const result = await this.prisma.$transaction([updateWallet, transaction])

    return result[result.length - 1]
  }

  async deleteTransaction(
    id: string,
    walletId: string,
    type: TransactionType,
    amount: number,
  ) {
    const updateWallet = this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        amount: {
          increment: -1 * this.utils.calculateWalletAmount(type, amount),
        },
      },
    })

    const deleteTransaction = this.prisma.transaction.delete({
      where: { id },
    })

    const result = await this.prisma.$transaction([
      updateWallet,
      deleteTransaction,
    ])

    return result[result.length - 1]
  }

  async transferTransaction(
    transaction: any,
    targetWalletId: string,
    targetCategoryId: string,
  ) {
    const updateSourceWallet = this.prisma.wallet.update({
      where: { id: transaction.walletId },
      data: {
        amount: {
          decrement: this.utils.calculateWalletAmount(
            transaction.type,
            transaction.amount,
          ),
        },
      },
    })

    const updateTargetWallet = this.prisma.wallet.update({
      where: { id: targetWalletId },
      data: {
        amount: {
          increment: this.utils.calculateWalletAmount(
            transaction.type,
            transaction.amount,
          ),
        },
      },
    })

    const updateTransaction = this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        wallet: {
          connect: {
            id: targetWalletId,
          },
        },
        category: {
          connect: {
            id: targetCategoryId,
          },
        },
      },
      include: {
        category: true,
        wallet: {
          include: {
            currency: true,
          },
        },
      },
    })

    const result = await this.prisma.$transaction([
      updateSourceWallet,
      updateTargetWallet,
      updateTransaction,
    ])

    return result[result.length - 1]
  }
}
