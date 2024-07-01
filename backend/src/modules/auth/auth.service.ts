import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { LoginDto } from '@auth/dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@core/prisma/prisma.service'
import { UtilsService } from '@core/utils/utils.service'
import { HTTP_MESSAGES } from '@consts/http-messages'
import { REFRESH_TOKEN_EXPIRATION_TIME } from '@consts/token'
import { ReshreshTokenDto } from '@auth/dto/refresh.dto'
import {
  RegistrationDto,
  VerifyRegistrationOtp,
} from '@auth/dto/registration.dto'
import { AuthRepository } from '@auth/auth.repository'
import { EmailService } from '@core/email/email.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly utils: UtilsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly repository: AuthRepository,
    private readonly emailService: EmailService,
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

    return {
      user,
      token: this.generateTokens(payload),
    }
  }

  private generateTokens(payload: { id: string; email: string }): {
    access: string
    refresh: string
  } {
    const access = this.jwtService.sign(payload)

    const refresh = this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
    })

    return { access, refresh }
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

      return {
        token: this.generateTokens(payload),
      }
    } catch (error) {
      throw new ForbiddenException(error.message)
    }
  }

  async registration({
    firstName,
    lastName,
    email,
    password,
  }: RegistrationDto): Promise<{ token: string }> {
    const existingUser = await this.repository.getUserByEmail(email)

    if (existingUser) {
      throw new BadRequestException(HTTP_MESSAGES.USER_EXISTS)
    }

    const otp = this.utils.generateOtp()

    await this.emailService.sendRegistrationOtp(email, otp)

    const result = await this.prisma.verificationCodes.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        otp,
        password: await this.utils.generateBcrypt(password),
        createdAt: new Date(),
      },
      create: {
        firstName,
        lastName,
        otp,
        email,
        password: await this.utils.generateBcrypt(password),
      },
    })

    return { token: result.id }
  }

  async verifyRegistrationOtp(body: VerifyRegistrationOtp) {
    try {
      const verificationCode = await this.prisma.verificationCodes.findUnique({
        where: {
          id: body.token,
        },
      })

      if (!verificationCode) throw new Error('Incorrect OTP')

      if (this.utils.isOtpExpired(verificationCode.createdAt)) {
        await this.prisma.verificationCodes.delete({
          where: { id: body.token },
        })
        throw new Error('OTP is expired')
      }

      if (body.otp !== verificationCode.otp) {
        throw new Error('Incorrect OTP')
      }

      const deleteVerificationCode = this.prisma.verificationCodes.delete({
        where: { id: verificationCode.id },
      })
      const createUser = this.prisma.user.create({
        data: {
          firstName: verificationCode.firstName,
          lastName: verificationCode.lastName,
          email: verificationCode.email,
          password: verificationCode.password,
        },
      })
      const result = await this.prisma.$transaction([
        deleteVerificationCode,
        createUser,
      ])
      const user = result[1]
      delete user.password

      return {
        user,
        token: this.generateTokens({ id: user.id, email: user.email }),
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
    }
  }
}
