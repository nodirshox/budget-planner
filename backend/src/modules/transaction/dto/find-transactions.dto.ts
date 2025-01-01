import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FindTransactionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Wallet Id', example: 'uuid' })
  walletId: string

  @IsDateString()
  @ApiProperty({ description: 'Start date', example: new Date() })
  startDate: string

  @IsDateString()
  @ApiProperty({ description: 'End date', example: new Date() })
  endDate: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Category Id', required: false, example: 'uuid' })
  categoryId: string
}
