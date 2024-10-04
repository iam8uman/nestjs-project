import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 100 })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 5 })
  minRating?: number;
}
