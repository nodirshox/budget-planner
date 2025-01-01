import { ApiProperty } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator'

export class WalletOverviewDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'Start date', example: new Date() })
  startDate: string

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ description: 'End date', example: new Date() })
  endDate: string

  @IsEnum(TransactionType)
  @ApiProperty({
    description: 'Category type',
    example: TransactionType.EXPENSE,
  })
  categoryType: TransactionType
}
