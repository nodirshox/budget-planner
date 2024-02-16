import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/core/prisma/prisma.service'
import { UtilsService } from '@/core/utils/utils.service'
import { HTTP_MESSAGES } from '@/consts/http-messages'

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

    const jwtToken = this.jwtService.sign(payload)
    return {
      user,
      token: {
        access: jwtToken,
      },
    }
  }
}
