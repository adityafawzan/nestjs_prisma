import { prismaExclude } from './../helper/prisma_exclude';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // POST /signup
  async signUp(authSignUpDto: AuthSignUpDto) {
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

      return user;
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
  async signIn(authSignInDto: AuthSignInDto) {
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

    const res = await this.prisma.user.findUnique({
      where: {
        username: authSignInDto.username,
      },
      select: prismaExclude.$exclude('user', ['hashed_password']),
    });

    return res;
  }
}
