import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { DailyService } from './services/daily.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, DailyService],
  exports: [SessionsService],
})
export class SessionsModule {}

