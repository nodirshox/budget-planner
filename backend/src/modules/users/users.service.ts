import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersRepository } from '@users/users.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { SetPasswordDto } from '@users/dto/password.dto'
import { UtilsService } from '@/core/utils/utils.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly utils: UtilsService,
  ) {}

  async getUserWithPassword(id: string) {
    return this.repository.getUserWithPassword(id)
  }

  async getUser(id: string) {
    const user = await this.repository.getUser(id)

    if (!user) {
      throw new BadRequestException(HTTP_MESSAGES.USER_NOT_FOUND)
    }

    return user
  }

  async setPassword(userId: string, body: SetPasswordDto) {
    const user = await this.getUserWithPassword(userId)

    if (!user) {
      throw new BadRequestException(HTTP_MESSAGES.USER_NOT_FOUND)
    }

    const isCorrectPassword = await this.utils.compareHash(
      body.oldPassword,
      user.password,
    )

    if (!isCorrectPassword) {
      throw new BadRequestException(HTTP_MESSAGES.WRONG_OLD_PASSWORD)
    }

    const newPassword = await this.utils.generateBcrypt(body.newPassword)

    await this.repository.setPassword(userId, newPassword)

    return { message: HTTP_MESSAGES.PASSWORD_UPDATED }
  }
}
