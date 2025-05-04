import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CvService } from '../cv/cv.service';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';
import { CreateCvDto } from '../cv/dto/create-cv.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateSkillDto } from '../skill/dto/create-skill.dto';
import {
  randFirstName,
  randLastName,
  randEmail,
  randJobTitle,
  randNumber,
  randImg,
} from '@ngneat/falso';
import { Skill } from 'src/skill/entities/skill.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const skillService = app.get(SkillService);
  const cvService = app.get(CvService);

  console.log('🔹 Seeding database...');

  // Generate skills one by one
  const skillsDto: CreateSkillDto[] = [
    { Designation: 'Java' },
    { Designation: 'Python' },
    { Designation: 'JavaScript' },
    { Designation: 'Project Management' },
    { Designation: 'Machine Learning' },
    { Designation: 'Database Management' },
  ];

  // Create skills individually (one by one)
  const skills: Skill[] = [];
  for (const skillDto of skillsDto) {
    const skill = await skillService.create(skillDto);
    skills.push(skill);
  }

  const userCount = 5;
  const users: any[] = [];

  for (let i = 0; i < userCount; i++) {
    const userDto: CreateUserDto = {
      username: `${randFirstName()} ${randLastName()}`,
      email: randEmail(),
      password: 'password123',
    };

    // Create user
    const user = await userService.createUser(userDto);
    users.push(user);

    // Generate a random number of skills for the user
    const randomSkills: Skill[] = [];
    const skillsCount = randNumber({ min: 1, max: 4 });
    for (let i = 0; i < skillsCount; i++) {
      randomSkills.push(skills[randNumber({ min: 0, max: skills.length - 1 })]);
    }

    // Generate CV for the user with a random selection of skills
    const cvDto: CreateCvDto = {
      name: `${randFirstName()} ${randLastName()}`,
      firstname: randFirstName(),
      age: randNumber({ min: 20, max: 50 }),
      cin: randNumber({ min: 10000000, max: 99999999 }).toString(),
      job: randJobTitle(),
      path: randImg(),
      userId: user.id,
      skillIds: randomSkills.map((skill) => skill.id),
    };

    const cv = await cvService.createCv(
      cvDto,
      user.id,
      randomSkills.map((skill) => skill.id),
    );

    console.log(`CV for ${user.username} created:`, cv);
  }

  console.log('Seed de la base de données terminé !');

  await app.close();
}
bootstrap();
