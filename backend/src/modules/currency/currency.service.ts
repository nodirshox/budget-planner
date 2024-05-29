import { BadRequestException, Injectable } from '@nestjs/common'
import { CurrencyRepository } from '@currency/currency.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class CurrencyService {
  constructor(private readonly repository: CurrencyRepository) {}

  async getCurrencies() {
    const currencies = await this.repository.getCurrencies()
    return { currencies }
  }

  async getCurrency(id: string) {
    const currency = await this.repository.getCurrency(id)

    if (!currency) {
      throw new BadRequestException(HTTP_MESSAGES.CURRENCY_NOT_FOUND)
    }

    return currency
  }
}
