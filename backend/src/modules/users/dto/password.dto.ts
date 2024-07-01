import { MAXIMUM_PASSWORD, MINIMUM_PASSWORD } from '@consts/password-salt'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(MINIMUM_PASSWORD)
  @MaxLength(MAXIMUM_PASSWORD)
  @ApiProperty({ description: 'Old password', example: 'example' })
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(MINIMUM_PASSWORD)
  @MaxLength(MAXIMUM_PASSWORD)
  @ApiProperty({ description: 'New password', example: 'new-example' })
  newPassword: string
}
