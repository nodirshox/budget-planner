import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { WalletsService } from '@/modules/wallets/wallets.service'
import {
  CreateWalletDto,
  UpdateWalletDto,
} from '@/modules/wallets/dto/create-wallet.dto'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@/modules/users/dto/user.interface'

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller({ path: 'wallets', version: '1' })
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create wallet' })
  createWallet(@User() user: IUser, @Body() body: CreateWalletDto) {
    return this.service.createWallet(user.id, body)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get wallets' })
  getWallets(@User() user: IUser) {
    return this.service.getWallets(user.id)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get wallet' })
  getWallet(@User() user: IUser, @Param('id') id: string) {
    return this.service.getWallet(user.id, id)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update wallet' })
  updateWallet(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() body: UpdateWalletDto,
  ) {
    return this.service.updateWallet(user.id, id, body)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete wallet' })
  deleteWallet(@User() user: IUser, @Param('id') id: string) {
    return this.service.deleteWallet(user.id, id)
  }
}
