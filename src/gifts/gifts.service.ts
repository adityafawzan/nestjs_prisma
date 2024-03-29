import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.gift.findMany();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const gift = await this.prisma.gift.findUnique({ where: { id } });
      if (!gift) {
        throw new NotFoundException(`Gift dengan id: ${id} tidak ditemukan`);
      }

      return gift;
    } catch (error) {
      throw error;
    }
  }

  async create(dto: CreateGiftDto) {
    const { name } = dto;
    try {
      return await this.prisma.gift.create({ data: dto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `Proses gagal, Gift dengan nama : ${name} sudah ada`,
          );
        }
      }
    }
  }

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

  async patch(id: number, updateGiftDto: UpdateGiftDto) {
    const { name } = updateGiftDto;
    try {
      return await this.prisma.gift.update({
        where: { id },
        data: { name: name },
      });
    } catch (error) {}
  }

  async remove(id: number) {
    try {
      return await this.prisma.gift.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

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

      const avg_stars = Math.round(avg_rating * 2) / 2;

      // update data rating gift
      await this.prisma.gift.update({
        where: { id: giftId },
        data: { rating: avg_rating, stars: avg_stars },
      });
      // update data rating gift

      return `Berhasil me-rating Redeemed Gift dengan ID : ${redeemedGiftId}`;
    } catch (error) {}
  }
}
