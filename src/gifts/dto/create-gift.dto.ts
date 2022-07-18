import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGiftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  is_deleted: boolean;
}
