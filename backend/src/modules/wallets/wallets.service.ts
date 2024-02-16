import { BadRequestException, Injectable } from '@nestjs/common'
import {
  CreateWalletDto,
  UpdateWalletDto,
} from '@/modules/wallets/dto/create-wallet.dto'
import { CurrencyService } from '@/modules/currency/currency.service'
import { WalletsRepository } from '@/modules/wallets/wallets.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { UsersService } from '@/modules/users/users.service'

@Injectable()
export class WalletsService {
  constructor(
    private readonly repository: WalletsRepository,
    private readonly currencyService: CurrencyService,
    private readonly userService: UsersService,
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
}
