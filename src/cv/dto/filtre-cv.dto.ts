import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltreCvDto {
  @IsOptional()
  @IsString()
  critere?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;
}
