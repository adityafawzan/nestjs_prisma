import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftEntity } from './entities/gift.entity';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('gifts')
@ApiTags('Gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  // GET /gifts
  @Get()
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findAll() {
    return this.giftsService.findAll();
  }

  // GET /gifts/id
  @Get(':id')
  @ApiOkResponse({ type: GiftEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(+id);
  }

  // POST /gifts
  @Post()
  @ApiAcceptedResponse({ type: GiftEntity })
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.create(createGiftDto);
  }

  // PUT /gifts/id
  @Put(':id')
  @ApiOkResponse({ type: GiftEntity })
  put(@Param('id') id: number, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.put(+id, updateGiftDto);
  }

  // PATCH /gifts/id
  @Patch(':id')
  @ApiOkResponse({ type: GiftEntity })
  patch(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.patch(+id, updateGiftDto);
  }

  // DELETE /gifts/id
  @Delete(':id')
  @ApiOkResponse({ type: GiftEntity })
  remove(@Param('id') id: string) {
    return this.giftsService.remove(+id);
  }

  // POST /gifts/id/redeem
  @Post(':id/redeem')
  @ApiAcceptedResponse({ type: GiftEntity })
  redeem(@Param('id') id: string) {
    return this.giftsService.redeem(+id);
  }

  // POST /gifts/id/rating
  @Post(':id/rating')
  @ApiAcceptedResponse({ type: GiftEntity })
  rating(@Param('id') redeemedGiftId: string, @Body('rating') rating: number) {
    return this.giftsService.rating(+redeemedGiftId, rating);
  }
}
