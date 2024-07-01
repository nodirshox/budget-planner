import { Module } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'

@Module({
  providers: [PrismaService],
})
export class PrismaModule {}
