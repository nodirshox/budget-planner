import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FindTransactionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Wallet Id', example: 'uuid' })
  walletId: string

  @IsDateString()
  @ApiProperty({ description: 'Month', example: new Date() })
  month: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Category Id', required: false, example: 'uuid' })
  categoryId: string
}
