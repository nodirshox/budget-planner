import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Category name', example: 'Groceries' })
  name: string
}
