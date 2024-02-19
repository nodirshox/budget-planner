import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transaction/transaction.repository'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { WalletsService } from '@/modules/wallets/wallets.service'
import { CategoryService } from '@/modules/category/category.service'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'
import { TransactionType } from '@prisma/client'

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly walletService: WalletsService,
    private readonly categoryService: CategoryService,
  ) {}

  async createTransaction(userId: string, body: CreateTransactionDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const category = await this.categoryService.getCategory(body.categoryId)

    const finalWalletAmount = this.calculateWalletAmount(
      wallet.amount,
      category.type,
      body.amount,
    )

    const transaction = await this.repository.createTransaction(
      body,
      category.type,
      finalWalletAmount,
    )

    return transaction
  }

  async filterTransactions(userId: string, body: FindTransactionsDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const transactions = await this.repository.filterTransactions(body)

    return { wallet, transactions }
  }

  calculateWalletAmount(
    walletAmount: number,
    type: TransactionType,
    amount: number,
  ): number {
    let finalAmount: number = walletAmount
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

  // Temp function to import csv to database
  /*
    import { createReadStream } from 'fs'
    import * as csv from 'csv-parser'

    async onModuleInit() {
    const csvFilePath = './data.csv'
    const userId = 'uuid'
    const walletId = 'uuid'
    const transactions = []
    createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        const category = await this.categoryService.findCategoryByName(
          row['Category name'],
          row['Type'] === 'Income'
            ? TransactionType.INCOME
            : TransactionType.EXPENSE,
        )
        const amount = Math.floor(Math.abs(parseFloat(row['Amount'])))
        transactions.push({ amount, type: category.type, date: row['Date'] })
        await this.createTransaction(userId, {
          amount,
          date: new Date(row['Date']),
          walletId,
          categoryId: category.id,
        })
      })
      .on('end', async () => {
        console.log('CSV file successfully processed')

        const newTransactions = await this.filterTransactions(userId, {
          walletId,
        })
        console.log('transactions', transactions.length)
        console.log('new transactions', newTransactions.transactions.length)
        for (let i = 0; i < transactions.length; i++) {
          if (
            transactions[i].amount !== newTransactions.transactions[i].amount
          ) {
            console.log(`${JSON.stringify(transactions[i])}`)
            console.log(newTransactions.transactions[i])
            // throw new Error('Does not match')
            i = transactions.length
          } else {
            console.log('correct')
          }
        }
      })
  }
  */
}
