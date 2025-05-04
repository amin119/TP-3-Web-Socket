import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatGateway } from './chat.gatway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}