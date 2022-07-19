import { AuthSignUpDto } from './../../auth/dto/auth-signup.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto extends PartialType(AuthSignUpDto) {}
