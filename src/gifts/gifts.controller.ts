import { SessionAuthGuard } from './../auth/guard/session-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftEntity } from './entities/gift.entity';

@Controller('gifts')
@ApiTags('Gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @UseGuards(SessionAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findAll() {
    return this.giftsService.findAll();
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.create(createGiftDto);
  }

  @UseGuards(SessionAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  put(@Param('id') id: number, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.put(+id, updateGiftDto);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  patch(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.patch(+id, updateGiftDto);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  remove(@Param('id') id: string) {
    return this.giftsService.remove(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Post(':id/redeem')
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  redeem(@Param('id') id: string) {
    return this.giftsService.redeem(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Post(':id/rating/:rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  rating(@Param('id') redeemedGiftId: string, @Param('rate') rating: string) {
    return this.giftsService.rating(+redeemedGiftId, parseFloat(rating));
  }
}
