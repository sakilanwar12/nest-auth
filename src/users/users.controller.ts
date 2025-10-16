import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './schemas/user.schemas';
import { PaginationQuery } from 'src/lib/query/pagination-query';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/lib/dtos/api-response.dto';
import { UserDto } from './dto/user.dto';
import { apiResponse } from 'src/lib/utils/apiResponse';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  @ApiResponse({ status: 201, description: 'User created', type: UserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return apiResponse({ data: user, message: 'User created successfully' });
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
    const users = await this.usersService.findAll(query.page, query.limit);
    const { data, pagination } = users;
    return apiResponse({
      data,
      pagination,
      message: 'Users created successfully',
    });
  }
  // GET /users/:id
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get single user', type: UserDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.findOne(id);
    return apiResponse({
      data,
      message: 'User get successfully',
      statusCode: 200,
    });
  }
  // DELETE /users/:id
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.usersService.remove(id);
    return apiResponse({
      data,
      message: 'Deleted successfully',
      statusCode: 200,
    });
  }
}
