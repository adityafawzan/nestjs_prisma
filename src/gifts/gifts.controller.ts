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
import { ApiBody } from '@nestjs/swagger';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  // GET /gifts
  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  // GET /gifts/id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftsService.findOne(+id);
  }

  // POST /gifts
  @Post()
  create(@Body() createGiftDto: CreateGiftDto) {
    return this.giftsService.create(createGiftDto);
  }

  // PUT /gifts/id
  @Put(':id')
  put(@Param('id') id: number, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.put(+id, updateGiftDto);
  }

  // PATCH /gifts/id
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateGiftDto: UpdateGiftDto) {
    return this.giftsService.patch(+id, updateGiftDto);
  }

  // DELETE /gifts/id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftsService.remove(+id);
  }

  // POST /gifts/id/redeem
  @Post(':id/redeem')
  redeem(@Param('id') id: string) {
    return this.giftsService.redeem(+id);
  }

  // POST /gifts/id/rating
  // @ApiBody({ description: 'input rating' })
  @Post(':id/rating')
  rating(@Param('id') redeemedGiftId: string, @Body('rating') rating: number) {
    return this.giftsService.rating(+redeemedGiftId, rating);
  }
}
