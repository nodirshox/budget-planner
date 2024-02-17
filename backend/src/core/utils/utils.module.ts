import { Module } from '@nestjs/common'
import { UtilsService } from '@/core/utils/utils.service'

@Module({
  providers: [UtilsService],
})
export class UtilsModule {}
