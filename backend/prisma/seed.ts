import * as bcrypt from 'bcrypt'
import { PrismaClient, TransactionType } from '@prisma/client'
import { PASSWORD_SALT } from '../src/consts/password-salt'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@mail.com',
      password: await bcrypt.hash('password', PASSWORD_SALT),
    },
  })

  await prisma.currency.createMany({
    data: [
      {
        name: 'USD',
      },
      {
        name: 'UZS',
      },
    ],
  })
  await prisma.category.createMany({
    data: [
      {
        name: 'Food & Drinks',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      {
        name: 'Transport',
        type: TransactionType.EXPENSE,
        userId: user.id,
      },
      {
        name: 'Salary',
        type: TransactionType.INCOME,
        userId: user.id,
      },
      {
        name: 'Extra',
        type: TransactionType.INCOME,
        userId: user.id,
      },
    ],
  })

  /*
  const categories = [
    { name: 'Transport', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Personal', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Home', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Qarz', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Food & Drink', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Water', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Other', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Cash out', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Office', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Groceries', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Entertainment', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Bills & Fees', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Electricity', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Gifts', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Beauty', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Healthcare', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Gas', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Shopping', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Tax', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Education', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Housing', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Loan', type: TransactionType.EXPENSE, userId: user.id },
    { name: 'Salary', type: TransactionType.INCOME, userId: user.id },
    { name: 'Extra Income', type: TransactionType.INCOME, userId: user.id },
    { name: 'Other', type: TransactionType.INCOME, userId: user.id },
    { name: 'Loan', type: TransactionType.INCOME, userId: user.id },
  ]
  await prisma.category.createMany({
    data: categories,
  })
  */
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
