import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private prisma: PrismaService) {}
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

  async redeem(id: number) {
    try {
      const res = await this.findOne(id);
      if (res) {
        return `item dengan id : ${id} berhasil diredeem`;
      } else {
        return `proses redeem gagal, item dengan id : ${id} tidak ditemukan`;
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.gift.findMany();
      // return await this.prisma.$queryRaw`SELECT * FROM Gift;`; RAW QUERY
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.gift.findUnique({ where: { id } });
      // return await this.prisma.$queryRaw`SELECT * FROM Gift WHERE id = ${id};`; RAW QUERY
    } catch (error) {
      throw error;
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
      // return await this.prisma.$executeRaw`DELETE FROM Gift WHERE id = ${id};`; RAW QUERY
    } catch (error) {
      throw error;
    }
  }
}
