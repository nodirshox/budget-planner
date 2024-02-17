import { Module } from '@nestjs/common'
import { PrismaModule } from '@/core/prisma/prisma.module'
import { PrismaService } from '@/core/prisma/prisma.service'
import { UtilsModule } from '@/core/utils/utils.module'
import { UtilsService } from '@/core/utils/utils.service'

@Module({
  imports: [PrismaModule, UtilsModule],
  providers: [PrismaService, UtilsService],
  exports: [PrismaService, UtilsService],
})
export class CoreModule {}
