import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './users.interface';

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
  async findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
