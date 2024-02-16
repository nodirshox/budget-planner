import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtPayload } from '@/modules/auth/dto/jwt.payload'
import { UsersService } from '@/modules//users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    const { id } = payload
    const user = await this.userService.getUserWithPassword(id)

    if (!user) {
      throw new UnauthorizedException()
    }

    return {
      id: payload.id,
    }
  }
}
