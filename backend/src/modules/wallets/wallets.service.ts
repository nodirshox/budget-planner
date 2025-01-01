import { BadRequestException, Injectable } from '@nestjs/common'
import {
  CreateWalletDto,
  UpdateWalletDto,
} from '@wallets/dto/create-wallet.dto'
import { CurrencyService } from '@currency/currency.service'
import { WalletsRepository } from '@wallets/wallets.repository'
import { HTTP_MESSAGES } from '@consts/http-messages'
import { UsersService } from '@users/users.service'
import { WalletOverviewDto } from '@wallets/dto/wallet-overview.dto'
import { CategoryService } from '@category/category.service'
import { UtilsService } from '@core/utils/utils.service'

@Injectable()
export class WalletsService {
  constructor(
    private readonly repository: WalletsRepository,
    private readonly currencyService: CurrencyService,
    private readonly userService: UsersService,
    private readonly categoryService: CategoryService,
    private readonly utils: UtilsService,
  ) {}

  async createWallet(userId: string, body: CreateWalletDto) {
    await this.currencyService.getCurrency(body.currencyId)

    return this.repository.createWallet(userId, body)
  }

  async getWallets(userId: string) {
    const wallets = await this.repository.getUserWallets(userId)
    const formattedWallets = wallets.map((wallet) => ({
      ...wallet,
      amount: this.utils.divideToOneHundred(wallet.amount),
    }))

    return {
      user: await this.userService.getUser(userId),
      wallets: formattedWallets,
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
    wallet.amount = this.utils.divideToOneHundred(wallet.amount)
    return wallet
  }

  async updateWallet(userId: string, id: string, body: UpdateWalletDto) {
    await this.getWallet(userId, id)

    return this.repository.updateWallet(id, body)
  }

  async deleteWallet(userId: string, id: string) {
    await this.getWallet(userId, id)
    return this.repository.deleteWallet(id)
  }

  async walletOverview(userId: string, id: string, body: WalletOverviewDto) {
    const wallet = await this.getWallet(userId, id)
    wallet.amount = this.utils.divideToOneHundred(wallet.amount)

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    if (startDate > endDate) {
      throw new BadRequestException('start date should less than end date')
    }

    const overview = await this.repository.getWalletOverview(
      id,
      body.categoryType,
      startDate,
      endDate,
    )

    const categories = await this.categoryService.getCategoriesByIds(
      overview.map((ov) => ov.categoryId),
    )
    let total = 0
    const transactionsWithCategory = overview.map((item) => {
      total += item._sum.amount
      return {
        total: this.utils.divideToOneHundred(item._sum.amount),
        transactions: item._count.id,
        categoryId: item.categoryId,
        categoryName: categories.find((ct) => ct.id === item.categoryId).name,
      }
    })

    return {
      total: this.utils.divideToOneHundred(total),
      overview: transactionsWithCategory,
      wallet,
    }
  }
}
