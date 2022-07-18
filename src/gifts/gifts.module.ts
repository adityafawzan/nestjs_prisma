import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { GiftsController } from './gifts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GiftsController],
  providers: [GiftsService],
})
export class GiftsModule {}
