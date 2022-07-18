import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GiftsModule } from './gifts/gifts.module';

@Module({
  imports: [PrismaModule, GiftsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
