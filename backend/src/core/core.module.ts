import { Module } from '@nestjs/common'
import { PrismaModule } from '@core/prisma/prisma.module'
import { PrismaService } from '@core/prisma/prisma.service'
import { UtilsModule } from '@core/utils/utils.module'
import { UtilsService } from '@core/utils/utils.service'
import { EmailModule } from '@core/email/email.module'
import { EmailService } from '@core/email/email.service'

@Module({
  imports: [PrismaModule, UtilsModule, EmailModule],
  providers: [PrismaService, UtilsService, EmailService],
  exports: [PrismaService, UtilsService, EmailService],
})
export class CoreModule {}
