import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrencyService } from '@/modules/currency/currency.service'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'

@ApiBearerAuth()
@ApiTags('Currencies')
@Controller({ path: 'currencies', version: '1' })
export class CurrencyController {
  constructor(private readonly service: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get currencies' })
  @UseGuards(JwtAuthGuard)
  getCurrencies() {
    return this.service.getCurrencies()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get currency' })
  @UseGuards(JwtAuthGuard)
  getCurrency(@Param('id') id: string) {
    return this.service.getCurrency(id)
  }
}
