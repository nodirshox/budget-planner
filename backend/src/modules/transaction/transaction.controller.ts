import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { TransactionService } from '@/modules/transaction/transaction.service'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@/modules/users/dto/user.interface'
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@/modules/transaction/dto/create-transaction.dto'
import { FindTransactionsDto } from '@/modules/transaction/dto/find-transactions.dto'

@ApiBearerAuth()
@ApiTags('Transaction')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'transactions', version: '1' })
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('click')
  @ApiOperation({ summary: 'Click' })
  click(@User() user) {
    return this.service.getClickBalance(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  createTransaction(@User() user: IUser, @Body() body: CreateTransactionDto) {
    return this.service.createTransaction(user.id, body)
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter transactions' })
  filterTransactions(@User() user: IUser, @Body() body: FindTransactionsDto) {
    return this.service.filterTransactions(user.id, body)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction' })
  getTransaction(@User() user: IUser, @Param('id') id: string) {
    return this.service.getTransaction(user.id, id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update transaction' })
  updateTransaction(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.service.updateTransaction(user.id, id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction' })
  deleteTransaction(@User() user: IUser, @Param('id') id: string) {
    return this.service.deleteTransaction(user.id, id)
  }
}
