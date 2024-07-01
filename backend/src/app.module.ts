import { Module } from '@nestjs/common'
import { UsersModule } from '@users/users.module'
import { AuthModule } from '@auth/auth.module'
import { CoreModule } from '@core/core.module'
import { WalletsModule } from '@wallets/wallets.module'
import { CurrencyModule } from '@currency/currency.module'
import { CategoryModule } from '@category/category.module'
import { TransactionModule } from '@transaction/transaction.module'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 100,
          ttl: 60000,
        },
      ],
    }),
    UsersModule,
    AuthModule,
    CoreModule,
    WalletsModule,
    CurrencyModule,
    CategoryModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
