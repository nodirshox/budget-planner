import { Module } from '@nestjs/common'
import { UsersModule } from '@users/users.module'
import { AuthModule } from '@auth/auth.module'
import { CoreModule } from '@/core/core.module'
import { WalletsModule } from '@wallets/wallets.module'
import { CurrencyModule } from '@currency/currency.module'
import { CategoryModule } from '@category/category.module'
import { TransactionModule } from '@transaction/transaction.module'
@Module({
  imports: [
    UsersModule,
    AuthModule,
    CoreModule,
    WalletsModule,
    CurrencyModule,
    CategoryModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
