// checked
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { PrismaService } from './../prisma/prisma.service';
import { prismaExclude } from './../helper/prisma_exclude';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // POST /signup
  async signUp(authSignUpDto: AuthSignUpDto): Promise<any> {
    const hashed_password = await argon.hash(authSignUpDto.password);

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
