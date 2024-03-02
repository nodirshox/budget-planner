import { ApiProperty } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category name', example: 'Groceries' })
  name: string

  @IsEnum(TransactionType)
  @IsNotEmpty()
  @ApiProperty({
    description: `Category type: ${TransactionType.EXPENSE} or ${TransactionType.INCOME}`,
    example: TransactionType.EXPENSE,
  })
  type: TransactionType
}
