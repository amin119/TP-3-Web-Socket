import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SkillController],

  providers: [SkillService, JwtAuthGuard],
})
export class SkillModule {}
