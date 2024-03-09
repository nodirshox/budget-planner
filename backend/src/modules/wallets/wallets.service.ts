import { BadRequestException, Injectable } from '@nestjs/common'
import {
  CreateWalletDto,
  UpdateWalletDto,
} from '@/modules/wallets/dto/create-wallet.dto'
import { CurrencyService } from '@/modules/currency/currency.service'
import { WalletsRepository } from '@/modules/wallets/wallets.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { UsersService } from '@/modules/users/users.service'
import { WalletOverviewDto } from '@/modules/wallets//dto/wallet-overview.dto'
import { CategoryService } from '@/modules/category/category.service'

@Injectable()
export class WalletsService {
  constructor(
    private readonly repository: WalletsRepository,
    private readonly currencyService: CurrencyService,
    private readonly userService: UsersService,
    private readonly categoryService: CategoryService,
  ) {}

  async createWallet(userId: string, body: CreateWalletDto) {
    await this.currencyService.getCurrency(body.currencyId)

    return this.repository.createWallet(userId, body)
  }

  async getWallets(userId: string) {
    return {
      user: await this.userService.getUser(userId),
      wallets: await this.repository.getUserWallets(userId),
    }
  }

  async getWallet(userId: string, walletId: string) {
    const wallet = await this.repository.getWallet(walletId)

    if (!wallet) {
      throw new BadRequestException(HTTP_MESSAGES.WALLET_NOT_FOUND)
    }

    if (wallet.userId !== userId) {
      throw new BadRequestException(HTTP_MESSAGES.WALLET_NOT_BELONGS_TO_USER)
    }

    return wallet
  }

  async updateWallet(userId: string, id: string, body: UpdateWalletDto) {
    await this.getWallet(userId, id)
    await this.currencyService.getCurrency(body.currencyId)

    return this.repository.updateWallet(id, body)
  }

  async deleteWallet(userId: string, id: string) {
    await this.getWallet(userId, id)
    return this.repository.deleteWallet(id)
  }

  async walletOverview(userId: string, id: string, body: WalletOverviewDto) {
    const wallet = await this.getWallet(userId, id)

    const year = new Date(body.month).getFullYear()
    const month = new Date(body.month).getMonth()

    const overview = await this.repository.getWalletOverview(
      id,
      body.categoryType,
      new Date(year, month, 1),
      new Date(year, month + 1, 1),
    )

    const categories = await this.categoryService.getCategoriesByIds(
      overview.map((ov) => ov.categoryId),
    )
    let total = 0
    const transactionsWithCategory = overview.map((item) => {
      total += item._sum.amount
      return {
        total: item._sum.amount,
        transactions: item._count.id,
        categoryId: item.categoryId,
        categoryName: categories.find((ct) => ct.id === item.categoryId).name,
      }
    })

    return {
      total,
      overview: transactionsWithCategory,
      wallet,
    }
  }
}
