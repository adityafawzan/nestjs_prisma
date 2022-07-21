// checked
import {
  Injectable,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from './../prisma/prisma.service';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaExclude } from './../helper/prisma_exclude';

import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async create(dto: AuthRegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.user.findMany({
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Berhasil mengambil semua data user',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      if (!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: `Gagal mengambil data, user dengan id : ${id} tidak ditemukan`,
          data: {},
        });
      }

      return {
        status: HttpStatus.FOUND,
        success: true,
        message: `Berhasil mengambil data user dengan id : ${id}`,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const { name, username, password } = dto;
    const hashed_password = await argon.hash(password);

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name,
          username,
          hashed_password,
        },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: `Berhasil mengubah data user dengan id : ${id}`,
        data: user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            status: HttpStatus.NOT_FOUND,
            success: false,
            message: `Gagal mengubah, user dengan id : ${id} tidak ditemukan`,
            data: {},
          });
        }

        if (error.code === 'P2002') {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            success: false,
            message: `Username ${username} sudah terpakai`,
            data: {},
          });
        }
      }

      throw error;
    }
  }

  async remove(id: number) {
    try {
      const role = await this.findOne(id);
      if (role.data.role === 'admin') {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          success: false,
          message: `Tidak diizinkan untuk menghapus user dengan role Admin`,
          data: {},
        });
      }

      const user = await this.prisma.user.delete({
        where: { id },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: `Berhasil menghapus user dengan id : ${id}`,
        data: user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            status: HttpStatus.NOT_FOUND,
            success: false,
            message: `Gagal menghapus, user dengan id : ${id} tidak ditemukan`,
            data: {},
          });
        }
      }

      throw error;
    }
  }
}
