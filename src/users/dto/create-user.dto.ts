import { AuthRegisterDto } from '../../auth/dto/auth-register.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto extends PartialType(AuthRegisterDto) {}
