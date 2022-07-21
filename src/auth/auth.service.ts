// checked
import { Injectable } from '@nestjs/common';
import { ForbiddenException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from './../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async register(dto: AuthRegisterDto): Promise<any> {
    const { name, username, password, role } = dto;
    const hashed_password = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          username,
          hashed_password,
          role,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Registrasi berhasil',
        data: {
          user_id: user.id,
          user_name: user.username,
        },
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
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

  async login(dto: AuthLoginDto): Promise<any> {
    const { username, password } = dto;
    let is_matched = false;

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      is_matched = await argon.verify(user.hashed_password, password);
    }

    if (!user || !is_matched) {
      return null;
    }

    return user;
  }
}
