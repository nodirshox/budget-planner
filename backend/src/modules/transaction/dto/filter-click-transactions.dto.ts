import { ApiProperty } from '@nestjs/swagger'
import { IsDateString } from 'class-validator'

export class FilterClickTransactionDto {
  @IsDateString()
  @ApiProperty({ description: 'Month', example: new Date() })
  month: string
}
