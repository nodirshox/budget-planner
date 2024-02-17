import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Transaction amount', example: 1000 })
  amount: number

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
