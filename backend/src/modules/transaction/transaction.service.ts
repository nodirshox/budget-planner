import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { TransactionRepository } from '@/modules/transaction/transaction.repository'
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@/modules/transaction/dto/create-transaction.dto'
import { WalletsService } from '@/modules/wallets/wallets.service'
import { CategoryService } from '@/modules/category/category.service'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'
import { UtilsService } from '@/core/utils/utils.service'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { createReadStream } from 'fs'
import * as csv from 'csv-parser'

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

    const transaction = await this.repository.createTransaction(
      body,
      category.type,
    )

    return transaction
  }

  async filterTransactions(userId: string, body: FindTransactionsDto) {
    const wallet = await this.walletService.getWallet(userId, body.walletId)
    const transactions = await this.repository.filterTransactions(body)

    return { wallet, transactions: this.utils.groupByDay(transactions) }
  }

  async getTransaction(userId: string, id: string) {
    const transaction = await this.repository.getTransaction(id)

    if (!transaction) {
      throw new BadRequestException(HTTP_MESSAGES.TRANSACTION_NOT_FOUND)
    }
    await this.walletService.getWallet(userId, transaction.walletId)

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
    body.oldAmount = oldTransaction.amount

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

  async getClickBalance(userId: string) {
    if (userId !== '63801aa8-2b4c-41c3-aedb-cde71179eeca') {
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
    console.log('authResponse', authResponse.data)
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
    console.log('balanceResponse', balanceResponse.data)
    return {
      balance: Math.floor(balanceResponse.data.result[0]?.balance) || 0,
    }
  }
}
