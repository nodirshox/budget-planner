import { Module } from '@nestjs/common'
import { EmailService } from '@core/email/email.service'

@Module({
  providers: [EmailService],
})
export class EmailModule {}
