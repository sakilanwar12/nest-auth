import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthUserSchemaDto } from './schemas/auth-user.schema';
import { AuthUserDto } from './dto/auth-user.dto';
import { apiResponse } from 'src/lib/utils/apiResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiResponse({ status: 201, description: 'User created', type: AuthUserDto })
  async create(@Body() createUserDto: AuthUserSchemaDto) {
    const user = await this.authService.create(createUserDto);
    return apiResponse({
      data: user,
      message: 'User Registration successfully',
    });
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
