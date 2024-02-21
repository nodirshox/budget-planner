import { ApiProperty } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Transaction amount', example: 1000 })
  amount: number

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction date', example: new Date() })
  date: Date

  @MaxLength(100, {
    message: 'Notes must be shorter than or equal to 100 characters',
  })
  @IsString()
  @ApiProperty({ description: 'Note', example: '' })
  notes: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Wallet Id', example: 'uuid' })
  walletId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category Id', example: 'uuid' })
  categoryId: string
}

export class UpdateTransactionDto extends CreateTransactionDto {
  oldType: TransactionType
  type: TransactionType
  oldAmount: number
}
