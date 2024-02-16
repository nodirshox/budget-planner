import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@/modules/users/dto/user.interface'
import { UsersService } from '@/modules/users/users.service'

@ApiTags('User')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user' })
  getUser(@User() user: IUser) {
    return this.service.getUser(user.id)
  }
}
