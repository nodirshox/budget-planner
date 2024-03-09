import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CreateWalletDto,
  UpdateWalletDto,
} from '@/modules/wallets/dto/create-wallet.dto'
import { Prisma, TransactionType } from '@prisma/client'

@Injectable()
export class WalletsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWallet(userId: string, body: CreateWalletDto) {
    const data: Prisma.WalletCreateInput = {
      name: body.name,
      user: {
        connect: {
          id: userId,
        },
      },
      currency: {
        connect: {
          id: body.currencyId,
        },
      },
    }

    return this.prisma.wallet.create({ data })
  }

  async getUserWallets(userId: string) {
    return this.prisma.wallet.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        currency: true,
      },
    })
  }

  async getWallet(id: string) {
    return this.prisma.wallet.findUnique({
      where: { id },
      include: {
        currency: true,
      },
    })
  }

  async updateWallet(id: string, body: UpdateWalletDto) {
    return this.prisma.wallet.update({
      where: { id },
      data: {
        name: body.name,
        currency: {
          connect: {
            id: body.currencyId,
          },
        },
      },
    })
  }

  async deleteWallet(id: string) {
    const deleteTransactions = this.prisma.transaction.deleteMany({
      where: {
        walletId: id,
      },
    })
    const deleteWallet = this.prisma.wallet.delete({
      where: { id },
    })

    const result = await this.prisma.$transaction([
      deleteTransactions,
      deleteWallet,
    ])

    return result[result.length - 1]
  }

  async getWalletOverview(
    walletId: string,
    transactionType: TransactionType,
    month: Date,
    nextMonth: Date,
  ) {
    const result = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        walletId,
        type: transactionType,
        date: {
          gte: month,
          lt: nextMonth,
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    })
    return result.sort((a, b) => b._sum.amount - a._sum.amount)
  }
}
