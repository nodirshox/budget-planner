import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { TransactionRepository } from '@transaction/transaction.repository'
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@transaction/dto/create-transaction.dto'
import { WalletsService } from '@wallets/wallets.service'
import { CategoryService } from '@category/category.service'
import { FindTransactionsDto } from '@transaction/dto/find-transactions.dto'
import { UtilsService } from '@core/utils/utils.service'
import { HTTP_MESSAGES } from '@consts/http-messages'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { TransactionType } from '@prisma/client'
import { FilterClickTransactionDto } from '@transaction/dto/filter-click-transactions.dto'
import { superUserId } from '@consts/super-user-id'
import { TransferTransactionDto } from './dto/transfer-transaction.dto'

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly walletService: WalletsService,
    private readonly categoryService: CategoryService,
    private readonly utils: UtilsService,
  ) {}

  async createTransaction(userId: string, body: CreateTransactionDto) {
    await this.walletService.getWallet(userId, body.walletId)
    const category = await this.categoryService.getCategory(
      userId,
      body.categoryId,
    )
    body.amount = this.utils.multipleByOneHundred(body.amount)
    const transaction = await this.repository.createTransaction(
      body,
      category.type,
    )
    transaction.amount = this.utils.divideToOneHundred(transaction.amount)
    return transaction
  }

  async filterTransactions(userId: string, body: FindTransactionsDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const transactions = await this.repository.filterTransactions(body)
    const formattedTransactions = transactions.map((transaction) => ({
      ...transaction,
      amount: this.utils.divideToOneHundred(transaction.amount),
    }))

    return {
      wallet,
      transactions: this.utils.groupByDay(formattedTransactions),
    }
  }

  async getTransaction(userId: string, id: string) {
    const transaction = await this.repository.getTransaction(id)

    if (!transaction) {
      throw new BadRequestException(HTTP_MESSAGES.TRANSACTION_NOT_FOUND)
    }
    await this.walletService.getWallet(userId, transaction.walletId)
    transaction.amount = this.utils.divideToOneHundred(transaction.amount)
    return transaction
  }

  async updateTransaction(
    userId: string,
    id: string,
    body: UpdateTransactionDto,
  ) {
    const oldTransaction = await this.getTransaction(userId, id)
    const oldCategory = await this.categoryService.getCategory(
      userId,
      oldTransaction.categoryId,
    )

    const category = await this.categoryService.getCategory(
      userId,
      body.categoryId,
    )
    body.walletId = oldTransaction.walletId
    body.oldType = oldCategory.type
    body.type = category.type
    body.oldAmount = this.utils.multipleByOneHundred(oldTransaction.amount)
    body.amount = this.utils.multipleByOneHundred(body.amount)

    return this.repository.updateTranasction(id, body)
  }

  async deleteTransaction(userId: string, id: string) {
    const transaction = await this.repository.getTransaction(id)

    if (!transaction) {
      throw new BadRequestException(HTTP_MESSAGES.TRANSACTION_NOT_FOUND)
    }
    await this.walletService.getWallet(userId, transaction.walletId)

    return this.repository.deleteTransaction(
      id,
      transaction.walletId,
      transaction.type,
      transaction.amount,
    )
  }

  // Temp function to import csv to database
  async onModuleInit() {
    /*
    const csvFilePath = './data.csv'
    const userId = 'uuid'
    const walletId = 'uuid'
    import { createReadStream } from 'fs'
    import * as csv from 'csv-parser'
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

  async getClickBalance(userId: string) {
    if (userId !== superUserId) {
      return { balance: 0 }
    }

    const URL = 'https://api.click.uz/evo'
    const phoneNumber = process.env.PHONE_NUMBER
    const deviceId = process.env.DEVICE_ID
    const password = process.env.PASSWORD
    const accountId = Number(process.env.ACCOUNT_ID)

    const authResponse = await axios.post(URL, {
      jsonrpc: '2.0',
      id: uuidv4(),
      method: 'login',
      params: {
        phone_number: phoneNumber,
        device_id: deviceId,
        password: password,
        datetime: 1711045989,
        app_version: '1.0',
      },
    })

    const balanceResponse = await axios({
      method: 'POST',
      url: URL,
      data: {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'get.balance',
        params: {
          account_id: [accountId],
        },
      },
      headers: {
        'Device-Id': deviceId,
        'Session-Key': authResponse.data?.result?.session_key,
      },
    })

    return {
      balance: Math.floor(balanceResponse.data.result[0]?.balance) || 0,
    }
  }

  async clickTransactions(userId: string, body: FilterClickTransactionDto) {
    if (userId !== superUserId) {
      return []
    }

    const URL = 'https://api.click.uz/evo'
    const phoneNumber = process.env.PHONE_NUMBER
    const deviceId = process.env.DEVICE_ID
    const password = process.env.PASSWORD
    const accountId = Number(process.env.ACCOUNT_ID)

    const authResponse = await axios.post(URL, {
      jsonrpc: '2.0',
      id: uuidv4(),
      method: 'login',
      params: {
        phone_number: phoneNumber,
        device_id: deviceId,
        password: password,
        datetime: 1711045989,
        app_version: '1.0',
      },
    })

    const { currentMonth, nextMonth } = this.utils.getMonths(
      new Date(body.month),
    )

    const balanceResponse = await axios({
      method: 'POST',
      url: URL,
      data: {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'history.monitoring',
        params: {
          account_id: [accountId],
          page_number: 1,
          page_size: 30,
          date_start: currentMonth.getTime(),
          date_end: nextMonth.getTime() + 1 * 24 * 60 * 60 * 1000, // +1 days
        },
      },
      headers: {
        'Device-Id': deviceId,
        'Session-Key': authResponse.data?.result?.session_key,
      },
    })

    const transactions = balanceResponse?.data?.result.filter(
      (t) => t.state === 1,
    )

    return {
      transactions: transactions.map((t) => {
        return {
          amount: Math.floor(t.amount),
          createdAt: new Date(t.datetime * 1000),
          description: t.service_name,
          type: t.credit ? TransactionType.INCOME : TransactionType.EXPENSE,
        }
      }),
    }
  }

  async transferTransaction(userId: string, body: TransferTransactionDto) {
    const transaction = await this.repository.getTransaction(body.transactionId)

    if (!transaction) {
      throw new BadRequestException(HTTP_MESSAGES.TRANSACTION_NOT_FOUND)
    }

    const sourceWallet = await this.walletService.getWallet(
      userId,
      transaction.walletId,
    )

    const targetWallet = await this.walletService.getWallet(
      userId,
      body.targetWalletId,
    )

    if (transaction.walletId === body.targetWalletId) {
      throw new BadRequestException(HTTP_MESSAGES.SAME_WALLET_TRANSFER)
    }

    if (sourceWallet.currencyId !== targetWallet.currencyId) {
      throw new BadRequestException(HTTP_MESSAGES.WALLET_CURRENCY_MISMATCH)
    }

    const targetCategory = await this.categoryService.getCategory(
      userId,
      body.targetCategoryId,
    )

    if (targetCategory.type !== transaction.type) {
      throw new BadRequestException(HTTP_MESSAGES.CATEGORY_TYPE_MISMATCH)
    }

    await this.repository.transferTransaction(
      transaction,
      body.targetWalletId,
      body.targetCategoryId,
    )

    return { message: 'OK' }
  }
}
