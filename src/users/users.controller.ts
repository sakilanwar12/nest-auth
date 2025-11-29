import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/lib/dtos/api-response.dto';
import { UserDto } from './dto/user.dto';
import { apiResponse } from 'src/lib/utils/apiResponse';

import { extractQueryObject } from 'src/lib/pagination/pagination.util';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'name' })
  @ApiQuery({ name: 'sort', required: false, type: String, example: 'name' })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination',
    type: ApiResponseDto,
  })
  async findAll(@Query() query: PaginationQueryDto) {
    const queryObj = extractQueryObject(query);

    const users = await this.usersService.findAll(queryObj);
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
