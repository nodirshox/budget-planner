import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from '@auth/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ReshreshTokenDto } from '@auth/dto/refresh.dto'
import {
  RegistrationDto,
  VerifyRegistrationOtp,
} from '@auth/dto/registration.dto'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  login(@Body() body: LoginDto) {
    return this.service.login(body)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  refresh(@Body() body: ReshreshTokenDto) {
    return this.service.refreshToken(body)
  }

  @Post('registration')
  @ApiOperation({ summary: 'Registration' })
  registration(@Body() body: RegistrationDto) {
    return this.service.registration(body)
  }

  @Post('registration/verify')
  @ApiOperation({ summary: '2-step: Verify registration OTP' })
  verifyRegistrationOtp(@Body() body: VerifyRegistrationOtp) {
    return this.service.verifyRegistrationOtp(body)
  }
}
