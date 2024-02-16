import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ description: 'Wallet name', example: 'Main' })
  name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Currency Id', example: 'uuid' })
  currencyId: string
}

export class UpdateWalletDto extends CreateWalletDto {}
