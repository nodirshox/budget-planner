import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class FindTransactionsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Wallet Id', example: 'uuid' })
  walletId: string

  @IsDateString()
  @ApiProperty({ description: 'Month', example: new Date() })
  month: string
}
