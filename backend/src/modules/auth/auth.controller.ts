import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '@auth/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ReshreshTokenDto } from '@auth/dto/refresh.dto'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  refresh(@Body() body: ReshreshTokenDto) {
    return this.authService.refreshToken(body)
  }
}
