import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersRepository } from '@users/users.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

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
}
