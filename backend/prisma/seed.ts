import * as bcrypt from 'bcrypt'
import { CategoryType, PrismaClient } from '@prisma/client'
import { PASSWORD_SALT } from '../src/consts/password-salt'

const prisma = new PrismaClient()

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
          type: CategoryType.EXPENSE,
        },
        {
          name: 'Transport',
          type: CategoryType.EXPENSE,
        },
        {
          name: 'Salary',
          type: CategoryType.INCOME,
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
