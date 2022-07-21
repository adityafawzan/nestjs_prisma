import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthRegisterDto } from '../auth/dto/auth-register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { SessionAuthGuard } from './../auth/guard/session-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiAcceptedResponse({ type: UserEntity })
  create(@Body() dto: AuthRegisterDto) {
    return this.usersService.create(dto);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
