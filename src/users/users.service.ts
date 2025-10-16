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

    return {
      data,
      pagination,
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
