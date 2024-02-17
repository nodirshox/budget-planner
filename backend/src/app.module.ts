import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CoreModule } from '@/core/core.module'
import { WalletsModule } from '@/modules/wallets/wallets.module'
import { CurrencyModule } from '@/modules/currency/currency.module'
import { CategoryModule } from '@/modules/category/category.module'
@Module({
  imports: [
    UsersModule,
    AuthModule,
    CoreModule,
    WalletsModule,
    CurrencyModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
