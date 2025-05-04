import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CvService } from './cv/cv.service';
import { UserService } from './user/user.service';
import { SkillService } from './skill/skill.service';

async function checkDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const skillService = app.get(SkillService);
  const cvService = app.get(CvService);

  const users = await userService.findAll();
  const skills = await skillService.findAll();
  const cvs = await cvService.findAll();

  console.log('🔹 Users:', users);
  console.log('🔹 Skills:', skills);
  console.log('🔹 CVs:', cvs);

  await app.close();
}

checkDatabase();
