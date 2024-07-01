import { PrismaService } from '@core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CurrencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrencies() {
    return this.prisma.currency.findMany()
  }

  async getCurrency(id: string) {
    return this.prisma.currency.findUnique({ where: { id } })
  }
}
