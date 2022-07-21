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
import { AuthRegisterDto } from './dto/auth-register.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { SessionAuthGuard } from './guard/session-auth.guard';

@Controller()
@ApiTags('Autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /register
  @Post('register')
  async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  // POST /login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return { User: req.user, msg: 'Berhasil login' };
  }

  // GET /logout
  @UseGuards(SessionAuthGuard)
  @Get('logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'Berhasil logout' };
  }
}
