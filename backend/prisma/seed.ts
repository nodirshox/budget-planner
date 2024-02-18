import * as bcrypt from 'bcrypt'
import { PrismaClient, TransactionType } from '@prisma/client'
import { PASSWORD_SALT } from '../src/consts/password-salt'

const prisma = new PrismaClient()

/*
const categories = [
  { name: 'Transport', type: TransactionType.EXPENSE },
  { name: 'Personal', type: TransactionType.EXPENSE },
  { name: 'Home', type: TransactionType.EXPENSE },
  { name: 'Qarz', type: TransactionType.EXPENSE },
  { name: 'Food & Drink', type: TransactionType.EXPENSE },
  { name: 'Water', type: TransactionType.EXPENSE },
  { name: 'Other', type: TransactionType.EXPENSE },
  { name: 'Cash out', type: TransactionType.EXPENSE },
  { name: 'Office', type: TransactionType.EXPENSE },
  { name: 'Groceries', type: TransactionType.EXPENSE },
  { name: 'Entertainment', type: TransactionType.EXPENSE },
  { name: 'Bills & Fees', type: TransactionType.EXPENSE },
  { name: 'Electricity', type: TransactionType.EXPENSE },
  { name: 'Gifts', type: TransactionType.EXPENSE },
  { name: 'Beauty', type: TransactionType.EXPENSE },
  { name: 'Healthcare', type: TransactionType.EXPENSE },
  { name: 'Gas', type: TransactionType.EXPENSE },
  { name: 'Shopping', type: TransactionType.EXPENSE },
  { name: 'Tax', type: TransactionType.EXPENSE },
  { name: 'Education', type: TransactionType.EXPENSE },
  { name: 'Housing', type: TransactionType.EXPENSE },
  { name: 'Loan', type: TransactionType.EXPENSE },
  { name: 'Salary', type: TransactionType.INCOME },
  { name: 'Extra Income', type: TransactionType.INCOME },
  { name: 'Other', type: TransactionType.INCOME },
  { name: 'Loan', type: TransactionType.INCOME },
]
*/

async function main() {
  return Promise.all([
    await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@mail.com',
        password: await bcrypt.hash('password', PASSWORD_SALT),
      },
    }),
    await prisma.currency.createMany({
      data: [
        {
          name: 'USD',
        },
        {
          name: 'UZS',
        },
      ],
    }),
    await prisma.category.createMany({
      data: [
        {
          name: 'Food & Drinks',
          type: TransactionType.EXPENSE,
        },
        {
          name: 'Transport',
          type: TransactionType.EXPENSE,
        },
        {
          name: 'Salary',
          type: TransactionType.INCOME,
        },
      ],
    }),
  ]).catch((error) => console.error(error))
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
