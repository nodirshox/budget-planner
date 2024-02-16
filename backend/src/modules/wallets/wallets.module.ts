import { Module } from '@nestjs/common'
import { WalletsController } from '@/modules/wallets/wallets.controller'
import { WalletsService } from '@/modules/wallets/wallets.service'
import { CoreModule } from '@/core/core.module'
import { CurrencyModule } from '@/modules/currency/currency.module'
import { WalletsRepository } from '@/modules/wallets/wallets.repository'
import { UsersModule } from '@/modules/users/users.module'

@Module({
  imports: [CoreModule, CurrencyModule, UsersModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository],
})
export class WalletsModule {}
