// checked
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from './../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // POST /register
  async register(dto: AuthRegisterDto): Promise<any> {
    const { name, username, password } = dto;
    const hashed_password = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          username,
          hashed_password,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return {
        msg: 'Registrasi user berhasil',
        user_id: user.id,
        user_name: user.username,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(`Username ${username} sudah terpakai`);
        }
      }

      throw error;
    }
  }

  // POST /login
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
      throw new ForbiddenException(
        `Autentikasi Gagal, Username/Password Salah`,
      );
    }

    return user;
  }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { sub: userId, username }, //payload
      {
        expiresIn: this.config.get('JWT_EXPIRATION'),
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return {
      access_token: token,
    };
  }
}
