import { IsOptional, IsPositive, IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
