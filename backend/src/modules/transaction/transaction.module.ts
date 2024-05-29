import { Module } from '@nestjs/common'
import { TransactionService } from '@transaction/transaction.service'
import { TransactionController } from '@transaction/transaction.controller'
import { CoreModule } from '@/core/core.module'
import { TransactionRepository } from '@transaction/transaction.repository'
import { WalletsModule } from '@wallets/wallets.module'
import { CategoryModule } from '@category/category.module'

@Module({
  imports: [CoreModule, WalletsModule, CategoryModule],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
