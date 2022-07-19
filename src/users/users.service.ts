import { AuthSignUpDto } from './../auth/dto/auth-signup.dto';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaExclude } from './../helper/prisma_exclude';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  async create(authSignUpDto: AuthSignUpDto) {
    try {
      return await this.authService.signUp(authSignUpDto);
    } catch (error) {
      throw error;
    }
  }

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

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });
      if (!user) {
        throw new ForbiddenException(
          'User dengan id : ' + id + ' tidak ditemukan',
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

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
            'User dengan id : ' + id + ' tidak ditemukan',
          );
        }
      }
      throw error;
    }
  }
}
