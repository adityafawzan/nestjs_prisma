import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GiftsModule } from './gifts/gifts.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    GiftsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
