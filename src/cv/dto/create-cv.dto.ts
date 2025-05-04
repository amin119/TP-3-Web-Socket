import { IsString, IsInt } from 'class-validator';

export class CreateCvDto {
  @IsString()
  name: string;

  @IsString()
  firstname: string;

  @IsInt()
  age: number;

  @IsString()
  cin: string;

  @IsString()
  job: string;

  @IsString()
  path: string;
  userId?: number; // relation 1 CV -> 1 User
  skillIds?: number[]; // relation CV <-> Skill (many-to-many)
}
