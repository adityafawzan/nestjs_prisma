// checked
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
@ApiTags('Autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Request() req): any {
    return req.user;
  }

  @Get('logout')
  logout(@Request() req): any {
    req.session.destroy();
    return {
      success: true,
      message: 'Berhasil logout',
      data: {},
    };
  }
}
