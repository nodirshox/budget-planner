import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@users/dto/user.interface'
import { UsersService } from '@users/users.service'

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user' })
  getUser(@User() user: IUser) {
    return this.service.getUser(user.id)
  }
}
