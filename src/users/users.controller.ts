import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './users.interface';
import { CreateUserDto } from './schemas/user.schemas';
import { PaginationQuery } from 'src/lib/query/pagination-query';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/lib/dtos/api-response.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  // GET /users
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination',
    type: ApiResponseDto,
  })
  async findAll(@Query() query: PaginationQuery) {
    return this.usersService.findAll(query.page, query.limit);
  }
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get single user', type: UserDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
