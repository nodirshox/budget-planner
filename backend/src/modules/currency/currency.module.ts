import { Module } from '@nestjs/common'
import { CurrencyService } from '@/modules/currency/currency.service'
import { CurrencyController } from '@/modules/currency/currency.controller'
import { CoreModule } from '@/core/core.module'
import { CurrencyRepository } from '@/modules/currency/currency.repository'

@Module({
  imports: [CoreModule],
  providers: [CurrencyService, CurrencyRepository],
  controllers: [CurrencyController],
  exports: [CurrencyService],
})
export class CurrencyModule {}
