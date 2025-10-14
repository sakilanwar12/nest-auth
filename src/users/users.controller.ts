import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './users.interface';
import { CreateUserDto } from './schemas/user.schemas';
import { PaginationQuery } from 'src/lib/query/pagination-query';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // POST /users
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.usersService.create(createUserDto);
  }

  // GET /users
  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return this.usersService.findAll(query.page, query.limit);
  }
}
