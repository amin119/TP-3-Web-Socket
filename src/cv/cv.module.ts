import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
//import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { Cv } from './entities/cv.entity';
import { CvControllerV2 } from './cv.controller.v2';
import { CvController } from './cv.controller';
import { PaginationService } from 'src/common/services/pagination.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, Skill, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CvController, CvControllerV2],
  providers: [CvService, PaginationService, JwtAuthGuard],
})
export class CvModule {}
