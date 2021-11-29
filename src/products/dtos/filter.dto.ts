import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, ValidateIf } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  limit: number;

  @IsOptional()
  @Min(0)
  @ApiProperty()
  offset: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty()
  minPrice: number;

  @ValidateIf((item) => item.minPrice)
  @IsPositive()
  @ApiProperty()
  maxPrice: number;
}
