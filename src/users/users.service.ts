import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaExclude } from './../helper/prisma_exclude';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';
import * as argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  // POST /users
  async create(authSignUpDto: AuthRegisterDto) {
    try {
      return await this.authService.register(authSignUpDto);
    } catch (error) {
      throw error;
    }
  }

  // GET /users
  async findAll() {
    try {
      const user = await this.prisma.user.findMany({
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // GET /users/id
  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      if (!user) {
        throw new ForbiddenException(`User dengan id : ${id} tidak ditemukan`);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /users/id
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { name, username, password, is_active } = updateUserDto;
    const hashed_password = await argon.hash(password);

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          name,
          username,
          hashed_password,
          is_active,
        },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException(
            `User dengan id : ${id} tidak ditemukan`,
          );
        }

        if (error.code === 'P2002') {
          throw new ForbiddenException(`Username ${username} sudah terpakai`);
        }
      }

      throw error;
    }
  }

  // DELETE /users/id
  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException(
            `User dengan id : ${id} tidak ditemukan`,
          );
        }

        return error;
      }

      // throw error;
    }
  }
}
