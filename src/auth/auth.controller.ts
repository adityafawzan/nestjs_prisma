// checked
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';

@Controller()
@ApiTags('Autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /signup
  @Post('signup')
  async signUp(@Body() authSignUpDto: AuthSignUpDto) {
    return await this.authService.signUp(authSignUpDto);
  }

  // POST /login
  @Post('login')
  async signIn(@Body() authSignInDto: AuthSignInDto) {
    return await this.authService.signIn(authSignInDto);
  }
}
