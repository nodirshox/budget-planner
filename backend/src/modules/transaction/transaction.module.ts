import { Module } from '@nestjs/common'
import { TransactionService } from '@/modules/transaction/transaction.service'
import { TransactionController } from '@/modules/transaction/transaction.controller'
import { CoreModule } from '@/core/core.module'
import { TransactionRepository } from '@/modules/transaction/transaction.repository'
import { WalletsModule } from '@/modules/wallets/wallets.module'
import { CategoryModule } from '@/modules/category/category.module'

@Module({
  imports: [CoreModule, WalletsModule, CategoryModule],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
