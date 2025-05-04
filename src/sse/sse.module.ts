import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { EventsModule } from '../events/events.module'; // Ensure EventsModule is exported from events.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    EventsModule, // To access events service
  ],
  controllers: [SseController],
  providers: [SseService],
})
export class SseModule {}