import { AuthSignInDto } from './dto/auth-signin.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signUp(@Body() authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }

  // POST /login
  @Post('login')
  signIn(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.signIn(authSignInDto);
  }
}
