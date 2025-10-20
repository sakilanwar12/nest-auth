import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './users.interface';
import * as bcrypt from 'bcrypt';
import { envVar } from 'src/config/envVar';
import { omit } from 'src/lib/utils/omit';
import { ISafeUser } from './entities/user.entity';
import { Prisma } from 'src/lib/prisma';
interface QueryObject<T> {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  filters?: T;
}
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // Create User
  async create(createUserDto: CreateUserDto): Promise<ISafeUser> {
    const { name, email, password, role } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const saltRounds = envVar.PASSWORD_SALT;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    const createdUser = await this.prisma.user.create({
      data: user,
    });
    const safeUser = omit(createdUser, ['password']);

    return safeUser;
  }
  async findAll<T extends object>(query: QueryObject<T>) {
    const { page, pageSize, search, sort, filters } = query;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (filters) {
      Object.assign(where, filters);
    }
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sort) {
      orderBy[sort] = 'asc';
    } else {
      orderBy['createdAt'] = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);
    const totalPages = Math.ceil(total / take);
    return {
      data,
      pagination: {
        total,
        page,
        limit: take,
        totalPages,
      },
    };
  }
  async findOne(id: number): Promise<Omit<IUser, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const safeUser = omit(user, ['password']);

    return safeUser;
  }
  async remove(id: number): Promise<Omit<IUser, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    const safeUser = omit(deletedUser, ['password']);

    return safeUser;
  }
}
