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
import { WalletOverviewDto } from '@/modules/wallets/dto/wallet-overview.dto'

@ApiBearerAuth()
@ApiTags('Wallet')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'wallets', version: '1' })
export class WalletsController {
  constructor(private readonly service: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create wallet' })
  createWallet(@User() user: IUser, @Body() body: CreateWalletDto) {
    return this.service.createWallet(user.id, body)
  }

  @Get()
  @ApiOperation({ summary: 'Get wallets' })
  getWallets(@User() user: IUser) {
    return this.service.getWallets(user.id)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wallet' })
  getWallet(@User() user: IUser, @Param('id') id: string) {
    return this.service.getWallet(user.id, id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update wallet' })
  updateWallet(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() body: UpdateWalletDto,
  ) {
    return this.service.updateWallet(user.id, id, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wallet' })
  deleteWallet(@User() user: IUser, @Param('id') id: string) {
    return this.service.deleteWallet(user.id, id)
  }

  @Put(':id/overview')
  @ApiOperation({ summary: 'Wallet overview' })
  walletOverview(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() body: WalletOverviewDto,
  ) {
    return this.service.walletOverview(user.id, id, body)
  }
}
