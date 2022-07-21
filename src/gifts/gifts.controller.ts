import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.create(createGiftDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  put(@Param('id') id: number, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.put(+id, updateGiftDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  patch(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.patch(+id, updateGiftDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GiftEntity })
  remove(@Param('id') id: string) {
    return this.giftsService.remove(+id);
  }

  @Post(':id/redeem')
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  redeem(@Param('id') id: string) {
    return this.giftsService.redeem(+id);
  }

  @Post(':id/rating/:rate')
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: GiftEntity })
  rating(@Param('id') redeemedGiftId: string, @Param('rate') rating: string) {
    return this.giftsService.rating(+redeemedGiftId, parseFloat(rating));
  }
}
