import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './users.interface';
import { apiResponse } from 'src/lib/utils/apiResponse';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // Create User
  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const { name, email, password, role } = createUserDto;

    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return apiResponse({ data, pagination });
  }
}
