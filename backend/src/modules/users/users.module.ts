import { Module } from '@nestjs/common'
import { UsersController } from '@users/users.controller'
import { UsersService } from '@users/users.service'
import { CoreModule } from '@core/core.module'
import { UsersRepository } from '@users/users.repository'

@Module({
  imports: [CoreModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
