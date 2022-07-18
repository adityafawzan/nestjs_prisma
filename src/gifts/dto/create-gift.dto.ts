import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateGiftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ default: '-' })
  @IsString()
  description: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ default: 'New' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  is_wishlisted: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  is_deleted: boolean;
}
