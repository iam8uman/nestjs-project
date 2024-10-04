import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'T-Shirt' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'T-Shirt description' })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100 })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 10 })
  stock: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['image1.jpg', 'image2.jpg'] })
  images: string[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  categoryId: number;
}
