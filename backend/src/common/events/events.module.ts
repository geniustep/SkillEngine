import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      // Use wildcard listeners
      wildcard: true,
      // Delimiter used to segment namespaces
      delimiter: '.',
      // Disable throwing errors when listeners don't exist
      ignoreErrors: false,
      // Max number of listeners per event
      maxListeners: 10,
      // Show warnings when max listeners is exceeded
      verboseMemoryLeak: true,
    }),
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
