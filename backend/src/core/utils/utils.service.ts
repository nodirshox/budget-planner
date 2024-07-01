import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PASSWORD_SALT } from '@consts/password-salt'
import { TransactionType } from '@prisma/client'
import { ITransactionWithCategory } from '@transaction/transaction.repository'
import { OTP_VALID_DURATION_MINUTES } from '@consts/token'

@Injectable()
export class UtilsService {
  generateBcrypt = async (password: string) => {
    return bcrypt.hash(password, PASSWORD_SALT)
  }

  compareHash = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compareSync(password, hash)
  }

  calculateWalletAmount(type: TransactionType, amount: number): number {
    return type === TransactionType.EXPENSE ? -1 * amount : amount
  }

  getMonths(date: Date): { currentMonth: Date; nextMonth: Date } {
    const inputDate = new Date(date)

    const currentMonth = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      1,
    )

    const nextMonth = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth() + 1,
      1,
    )

    return { currentMonth, nextMonth }
  }

  groupByDay(transactions: ITransactionWithCategory[]) {
    const groups = {}

    transactions.forEach((transaction) => {
      const day = new Date(transaction.date).toISOString().split('T')[0]
      if (!groups[day]) {
        groups[day] = { transactions: [], total: 0 }
      }
      if (transaction.type === TransactionType.EXPENSE) {
        groups[day].total -= transaction.amount
      } else if (transaction.type === TransactionType.INCOME) {
        groups[day].total += transaction.amount
      }

      groups[day].transactions.push(transaction)
    })

    const groupedByDay = Object.keys(groups).map((day) => ({
      day: new Date(day),
      transactions: groups[day].transactions,
      total: groups[day].total,
    }))
    return groupedByDay
  }

  multipleByOneHundred(num: number) {
    return num * 100
  }

  divideToOneHundred(num: number) {
    return num / 100
  }

  generateOtp(): string {
    let otp = ''
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 100) % 10
    }
    return otp
  }

  isOtpExpired(createdAt: Date): boolean {
    return (
      (new Date().getTime() - createdAt.getTime()) / (60 * 1000) >
      OTP_VALID_DURATION_MINUTES
    )
  }
}
