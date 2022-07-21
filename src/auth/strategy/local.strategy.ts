// checked
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authService.login({ username, password });
      if (!user) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Username atau password salah',
          data: {},
        });
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Login berhasil',
        data: {
          user_id: user.id,
          user_name: user.username,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
