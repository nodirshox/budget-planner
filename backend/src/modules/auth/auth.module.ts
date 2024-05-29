import { Module } from '@nestjs/common'
import { AuthController } from '@auth/auth.controller'
import { AuthService } from '@auth/auth.service'
import { UsersModule } from '@users/users.module'
import { CoreModule } from '@/core/core.module'
import { JwtStrategy } from '@auth/auth.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ACCESS_TOKEN_EXPIRATION_TIME } from '@/consts/token'

@Module({
  imports: [
    UsersModule,
    CoreModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
