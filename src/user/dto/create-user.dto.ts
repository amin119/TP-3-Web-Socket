import { IsString, IsEmail, IsOptional } from 'class-validator';
export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
<<<<<<< HEAD
}
=======

  @IsOptional()
  @IsString()
  salt?: string;

  @IsOptional()
  @IsString()
  role?: string;

}
>>>>>>> origin/feature/auth-module
