import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from './common/auth.middleware';
import * as dotenv from 'dotenv';
import { Skill } from './skill/entities/skill.entity';
import { User } from './user/entities/user.entity';
import { Cv } from './cv/entities/cv.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Event } from './events/event.entity';
import { EventsModule } from './events/events.module';
import { SseModule } from './sse/sse.module';
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/entities/message.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    CvModule,
    SkillModule,
    UserModule,
    AuthModule,
    EventsModule,
    SseModule,
    ChatModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Skill, User, Cv, Event, Message],
      synchronize: false,
      dropSchema: false,
    }),
    TypeOrmModule.forFeature([Event, Message]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'sse/events', method: RequestMethod.GET },
        { path: 'chat', method: RequestMethod.ALL }
      )
      .forRoutes(
        { path: 'cv', method: RequestMethod.POST, version: '2' },
        { path: 'cv/:id', method: RequestMethod.PUT, version: '2' },
        { path: 'cv/:id', method: RequestMethod.DELETE, version: '2' },
        { path: 'events', method: RequestMethod.ALL },
      );
  }
}