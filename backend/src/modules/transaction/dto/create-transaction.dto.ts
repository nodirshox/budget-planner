import { ApiProperty } from '@nestjs/swagger'
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Wallet Id', example: 'uuid' })
  walletId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category Id', example: 'uuid' })
  categoryId: string
}

export class UpdateTransactionDto extends CreateTransactionDto {}
