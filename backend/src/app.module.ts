import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CoreModule } from '@/core/core.module'
import { WalletsModule } from '@/modules/wallets/wallets.module'
import { CurrencyModule } from '@/modules/currency/currency.module'
@Module({
  imports: [UsersModule, AuthModule, CoreModule, WalletsModule, CurrencyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
