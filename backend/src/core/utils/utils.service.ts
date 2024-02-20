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
    let finalAmount = 0
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
}
