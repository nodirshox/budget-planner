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
