import { ApiProperty } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator'

export class WalletOverviewDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'Month', example: new Date() })
  month: string

  @IsEnum(TransactionType)
  @ApiProperty({
    description: 'Category type',
    example: TransactionType.EXPENSE,
  })
  categoryType: TransactionType
}
