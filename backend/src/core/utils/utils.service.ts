import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { PASSWORD_SALT } from '@/consts/password-salt'
import { TransactionType } from '@prisma/client'

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

  getMonths(date: Date) {
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
}
