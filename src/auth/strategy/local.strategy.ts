// checked
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authService.signIn({ username, password });
      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return error;
      }

      throw error;
    }
  }
}
