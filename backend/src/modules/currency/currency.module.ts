import { Module } from '@nestjs/common'
import { CurrencyService } from '@currency/currency.service'
import { CurrencyController } from '@currency/currency.controller'
import { CoreModule } from '@core/core.module'
import { CurrencyRepository } from '@currency/currency.repository'

@Module({
  imports: [CoreModule],
  providers: [CurrencyService, CurrencyRepository],
  controllers: [CurrencyController],
  exports: [CurrencyService],
})
export class CurrencyModule {}
