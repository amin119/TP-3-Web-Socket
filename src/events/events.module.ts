import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService], // Important for other modules to use EventsService
})
export class EventsModule {}