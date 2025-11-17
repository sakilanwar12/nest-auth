import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthUserSchemaDto } from './schemas/auth-user.schema';
import { AuthUserDto, RefreshTokenDto } from './dto/auth-user.dto';
import { apiResponse } from 'src/lib/utils/apiResponse';
import { loginUserSchemaDto, refreshTokenSchemaDto } from './schemas/login-user-schema';
import { Body, Controller, Post } from '@nestjs/common';

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
  @Post('/login')
  @ApiResponse({ status: 201, description: 'User login', type: AuthUserDto })
  async login(@Body() loginUserDto: loginUserSchemaDto) {
    const user = await this.authService.login(loginUserDto);
    return apiResponse({
      data: user,
      message: 'User login successfully',
    });
  }
  @Post('/refresh-token')
  @ApiResponse({
    status: 201,
    description: 'Get new access token',
    type: RefreshTokenDto,
  })
  async refreshToken(@Body() refreshTokenSchemaDto: refreshTokenSchemaDto) {
    const user = await this.authService.refreshToken(refreshTokenSchemaDto);
    return apiResponse({
      data: user,
      message: 'Get access token successfully',
    });
  }
}
