import { Injectable, OnModuleInit } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transaction/transaction.repository'
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto'
import { WalletsService } from '@/modules/wallets/wallets.service'
import { CategoryService } from '@/modules/category/category.service'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'
import { TransactionType } from '@prisma/client'
import { createReadStream } from 'fs'
import * as csv from 'csv-parser'

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly walletService: WalletsService,
    private readonly categoryService: CategoryService,
  ) {}

  async createTransaction(userId: string, body: CreateTransactionDto) {
    await this.walletService.getWallet(userId, body.walletId)
    const category = await this.categoryService.getCategory(
      userId,
      body.categoryId,
    )

    const transaction = await this.repository.createTransaction(
      body,
      category.type,
    )

    return transaction
  }

  async filterTransactions(userId: string, body: FindTransactionsDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const transactions = await this.repository.filterTransactions(body)

    return { wallet, transactions: this.groupByDay(transactions) }
  }

  groupByDay(transactions) {
    const groups = {}

    transactions.forEach((transaction) => {
      const day = new Date(transaction.date).toISOString().split('T')[0]
      if (!groups[day]) {
        groups[day] = []
      }
      groups[day].push(transaction)
    })

    const groupedByDay = Object.keys(groups).map((day) => ({
      day: new Date(day),
      transactions: groups[day],
    }))

    return groupedByDay
  }

  // Temp function to import csv to database
  async onModuleInit() {
    const csvFilePath = './data.csv'
    const userId = 'uuid'
    const walletId = 'uuid'
    /*
    createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        const categoryType =
          row['Type'] === 'Income'
            ? TransactionType.INCOME
            : TransactionType.EXPENSE
        const categoryName = row['Category name']
        const date = new Date(row['Date'])
        const notes = row['Note']

        const amount = Math.floor(Math.abs(parseFloat(row['Amount'])))

        const category = await this.categoryService.findCategoryByName(
          userId,
          categoryName,
          categoryType,
        )

        await this.repository.createTransaction(
          {
            amount,
            date,
            notes,
            walletId,
            categoryId: category.id,
          },
          category.type,
        )
      })
      .on('end', async () => {
        console.log('CSV file successfully processed')
      })
      */
  }
}
