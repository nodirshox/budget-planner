import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body)
  }
}
