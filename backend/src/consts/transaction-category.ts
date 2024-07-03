import { TransactionType } from '@prisma/client'

export const USER_CATEGORIES: { name: string; type: TransactionType }[] = [
  {
    name: 'Groceries',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Bills & Fees',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Transportation',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Food & Drink',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Shopping',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Gifts',
    type: TransactionType.EXPENSE,
  },
  {
    name: 'Salary',
    type: TransactionType.INCOME,
  },
  {
    name: 'Extra Income',
    type: TransactionType.INCOME,
  },
  {
    name: 'Other',
    type: TransactionType.INCOME,
  },
]
