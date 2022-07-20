import { IsString } from 'class-validator';
import { prismaExclude } from './../helper/prisma_exclude';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // POST /signup
  async signUp(authSignUpDto: AuthSignUpDto): Promise<any> {
    const password = authSignUpDto.password;
    const hashed_password = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: authSignUpDto.name,
          username: authSignUpDto.username,
          hashed_password: hashed_password,
        },
        select: prismaExclude.$exclude('user', ['hashed_password']),
      });

      return this.signToken(user.id, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            `Username ${authSignUpDto.username} sudah terpakai`,
          );
        }
      }
      throw error;
    }
  }

  // POST /login
  async signIn(authSignInDto: AuthSignInDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: authSignInDto.username,
      },
    });

    if (!user) {
      throw new ForbiddenException(
        `Autentikasi Gagal, Username/Password Salah`,
      );
    }

    const is_matched = await argon.verify(
      user.hashed_password,
      authSignInDto.password,
    );

    if (!is_matched) {
      throw new ForbiddenException(
        `Autentikasi Gagal, Username/Password Salah`,
      );
    }

    return this.signToken(user.id, user.username);
  }

  // async validasiUser(username: string, password: string): Promise<any> {
  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: { username },
  //     });

  //     if (!user) {
  //       throw new ForbiddenException(`Username/password salah`);
  //     }

  //     const is_matched = await argon.verify(user.hashed_password, password);

  //     if (!is_matched) {
  //       throw new ForbiddenException(`Username/password salah`);
  //     }

  //     delete user.hashed_password;
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, username };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '16m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
