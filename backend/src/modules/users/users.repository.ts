import { PrismaService } from '@core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserWithPassword(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async getUser(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  setPassword(id: string, password: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password,
      },
    })
  }
}
