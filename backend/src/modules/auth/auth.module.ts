import { Module } from '@nestjs/common'
import { AuthController } from '@/modules/auth/auth.controller'
import { AuthService } from '@/modules/auth/auth.service'
import { UsersModule } from '@/modules/users/users.module'
import { CoreModule } from '@/core/core.module'
import { JwtStrategy } from '@/modules/auth/auth.strategy'
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
