import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TransferTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transaction Id', example: 'uuid' })
  transactionId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Target Wallet Id', example: 'uuid' })
  targetWalletId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Target Category Id', example: 'uuid' })
  targetCategoryId: string
}
