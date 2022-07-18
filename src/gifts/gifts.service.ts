import { getStars } from './../helper/hitung_bintang';
import { PrismaService } from './../prisma/prisma.service';
import { Body, Injectable } from '@nestjs/common';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  // GET /gifts
  async findAll() {
    try {
      return await this.prisma.gift.findMany();
      // return await this.prisma.$queryRaw`SELECT * FROM Gift;`; RAW QUERY
    } catch (error) {
      throw error;
    }
  }

  // GET /gifts/id
  async findOne(id: number) {
    try {
      return await this.prisma.gift.findUnique({ where: { id } });
      // return await this.prisma.$queryRaw`SELECT * FROM Gift WHERE id = ${id};`; RAW QUERY
    } catch (error) {
      throw error;
    }
  }

  // POST /gifts
  async create(createGiftDto: CreateGiftDto) {
    try {
      return await this.prisma.gift.create({ data: createGiftDto });
    } catch (error) {
      if (error.code === 'P2002') {
        return (
          'Proses gagal, Gift dengan nama : ' +
          createGiftDto.name +
          ' sudah ada'
        );
      }
    }
  }

  // PUT /gifts/id
  async put(id: number, updateGiftDto: UpdateGiftDto) {
    try {
      return await this.prisma.gift.update({
        where: { id },
        data: updateGiftDto,
      });
    } catch (error) {
      throw error;
    }
  }

  // PATCH /gifts/id
  async patch(id: number, updateGiftDto: UpdateGiftDto) {
    const { name } = updateGiftDto;
    try {
      return await this.prisma.gift.update({
        where: { id },
        data: { name: name },
      });
    } catch (error) {}
  }

  // DELETE /gifts/id
  async remove(id: number) {
    try {
      return await this.prisma.gift.delete({
        where: { id },
      });
      // return await this.prisma.$executeRaw`DELETE FROM Gift WHERE id = ${id};`; RAW QUERY
    } catch (error) {
      throw error;
    }
  }

  // POST /gifts/id/redeem
  async redeem(id: number) {
    try {
      const res = await this.findOne(id);
      if (res == null) {
        return `Gagal me-redeem, Gift dengan ID : ${id} tidak ditemukan`;
      }

      const quantity = res.quantity;
      if (quantity == 0) {
        return `Gagal me-redeem, Gift dengan ID : ${id} tidak ada stok`;
      }

      await this.prisma.redeemedGift.create({
        data: { giftId: id },
      });

      await this.prisma.gift.update({
        where: { id },
        data: { quantity: quantity - 1 },
      });
      return `Berhasil Redeem, Gift dengan id : ${id}`;
    } catch (error) {
      throw error;
    }
  }

  // POST /gifts/id/rating
  async rating(redeemedGiftId: number, rating: number) {
    try {
      const res = await this.prisma.redeemedGift.findUnique({
        where: { id: redeemedGiftId },
      });

      if (res == null) {
        return `Gagal me-rating, Redeemed Gift dengan ID : ${redeemedGiftId} tidak ditemukan`;
      }

      if (res.is_rated) {
        return `Gagal me-rating, Redeemed Gift dengan ID : ${redeemedGiftId} sudah pernah di-rating`;
      }

      const giftId = res.giftId;

      // insert data rating redeemedgift
      await this.prisma.ratedGift.create({
        data: {
          giftId: giftId,
          redeemedGiftId: redeemedGiftId,
          rating: rating,
        },
      });
      // insert data rating redeemedgift

      // update data is_rated redeemedgift
      await this.prisma.redeemedGift.update({
        where: { id: redeemedGiftId },
        data: { is_rated: true },
      });
      // update data is_rated redeemedgift

      // hitung average rating gift
      const aggregate = await this.prisma.ratedGift.aggregate({
        _avg: {
          rating: true,
        },
        where: { giftId: giftId },
      });

      const avg_rating = aggregate._avg.rating;
      // hitung average rating gift

      const avg_stars = await this.getStars(avg_rating);

      // update data rating gift
      await this.prisma.gift.update({
        where: { id: giftId },
        data: { rating: avg_rating, stars: 4 },
      });
      // update data rating gift

      return `Berhasil me-rating Redeemed Gift dengan ID : ${redeemedGiftId}`;
    } catch (error) {}
  }

  async getStars(rating: any) {
    return rating;
  }
}
