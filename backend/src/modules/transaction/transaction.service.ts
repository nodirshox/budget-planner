import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transaction/transaction.repository'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { WalletsService } from '@/modules/wallets/wallets.service'
import { CategoryService } from '@/modules/category/category.service'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly walletService: WalletsService,
    private readonly categoryService: CategoryService,
  ) {}

  async createTransaction(userId: string, body: CreateTransactionDto) {
    await this.walletService.getWallet(userId, body.walletId)
    const category = await this.categoryService.getCategory(body.categoryId)

    return this.repository.createTransaction(body, category.type)
  }

  async filterTransactions(userId: string, body: FindTransactionsDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const transactions = await this.repository.filterTransactions(body)

    return { wallet, transactions }
  }
}
