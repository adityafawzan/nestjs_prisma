import { ApiProperty } from '@nestjs/swagger';
import { Gift } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

export class GiftEntity implements Gift {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ default: '-' })
  description: string;

  @ApiProperty({ default: 1 })
  quantity: number;

  @ApiProperty({ default: 0 })
  rating: Decimal;

  @ApiProperty()
  stars: number;

  @ApiProperty({ default: 'New' })
  status: string;

  @ApiProperty({ default: false })
  is_wishlisted: boolean;

  @ApiProperty({ default: true })
  is_active: boolean;

  @ApiProperty({ default: false })
  is_deleted: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
