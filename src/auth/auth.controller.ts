import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { AuthSignUpDto } from './dto/auth-signup.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller()
@ApiTags('Autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /signup
  @Post('signup')
  signUp(@Body() authSignUpDto: AuthSignUpDto) {
    return this.authService.signUp(authSignUpDto);
  }

  // POST /login
  @Post('login')
  signIn(@Body() authSignInDto: AuthSignInDto) {
    return this.authService.signIn(authSignInDto);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   return await this.authService.signToken(req.user);
  // }
}
