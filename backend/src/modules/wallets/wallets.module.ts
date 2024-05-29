import { Module } from '@nestjs/common'
import { WalletsController } from '@wallets/wallets.controller'
import { WalletsService } from '@wallets/wallets.service'
import { CoreModule } from '@/core/core.module'
import { CurrencyModule } from '@currency/currency.module'
import { WalletsRepository } from '@wallets/wallets.repository'
import { UsersModule } from '@users/users.module'
import { CategoryModule } from '@category/category.module'

@Module({
  imports: [CoreModule, CurrencyModule, UsersModule, CategoryModule],
  controllers: [WalletsController],
  providers: [WalletsService, WalletsRepository],
  exports: [WalletsService],
})
export class WalletsModule {}
