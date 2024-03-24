import * as bcrypt from 'bcrypt'
import { PrismaClient, TransactionType } from '@prisma/client'
import { PASSWORD_SALT } from '../src/consts/password-salt'

const prisma = new PrismaClient()

async function main() {
  /*

  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@mail.com',
      password: await bcrypt.hash('password', PASSWORD_SALT),
    },
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
  */
  /*
  const wallets = await prisma.wallet.findMany()

  for (const wallet of wallets) {
    await prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        amount: wallet.amount * 100,
      },
    })
  }
  */
  /*
  const transactions = await prisma.transaction.findMany()
  let i = 0
  for (const transaction of transactions) {
    await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        amount: transaction.amount * 100,
      },
    })
    i++
  }
  console.log('done', i)
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
