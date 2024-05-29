import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { LoginDto } from '@auth/dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/core/prisma/prisma.service'
import { UtilsService } from '@/core/utils/utils.service'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { REFRESH_TOKEN_EXPIRATION_TIME } from '@/consts/token'
import { ReshreshTokenDto } from '@auth/dto/refresh.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly utils: UtilsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    })
    if (!user) throw new BadRequestException(HTTP_MESSAGES.USER_NOT_FOUND)
    const isCorrectPassword = await this.utils.compareHash(
      body.password,
      user.password,
    )
    if (!isCorrectPassword) {
      throw new BadRequestException(HTTP_MESSAGES.WRONG_PASSWORD)
    }
    delete user.password

    const payload = { id: user.id, email: user.email }

    const access = this.jwtService.sign(payload)

    const refresh = this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    })

    return {
      user,
      token: {
        access,
        refresh,
      },
    }
  }

  async refreshToken(body: ReshreshTokenDto) {
    try {
      const decodedToken = this.jwtService.decode(body.refreshToken)
      if (!decodedToken) throw new Error('Invalid token')

      const { id, exp } = decodedToken as { id; role; exp }

      const isTokenExpired = Date.now() >= exp * 1000

      if (isTokenExpired) {
        throw new Error('Token expired')
      }

      const user = await this.prisma.user.findUnique({
        where: { id },
      })
      if (!user) throw new Error(HTTP_MESSAGES.USER_NOT_FOUND)

      const payload = { id: user.id, email: user.email }

      const access = this.jwtService.sign(payload)
      const refresh = this.jwtService.sign(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
      })

      return {
        token: { access, refresh },
      }
    } catch (error) {
      throw new ForbiddenException(error.message)
    }
  }
}
