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
import { ISafeUser } from './entities/user.entity';
import { Prisma } from 'src/lib/prisma';
import { IQueryObject } from 'src/lib/common-api.types';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { omitKeys } from 'js-utility-method';
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginator: PaginationService,
  ) {}
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
    const safeUser = omitKeys(createdUser, ['password']);

    return safeUser;
  }
  async findAll<T extends object>(query: IQueryObject<T>) {
    const { page, pageSize, search, sort, filters } = query;

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

    return this.paginator.paginate<IUser>(
      { page, pageSize },
      (skip, take) => this.prisma.user.findMany({ skip, take, where, orderBy }),
      () => this.prisma.user.count({ where }),
    );
  }
  async findOne(id: number): Promise<Omit<IUser, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const safeUser = omitKeys(user, ['password']);

    return safeUser;
  }
  async remove(id: number): Promise<Omit<IUser, 'password'>> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    const safeUser = omitKeys(deletedUser, ['password']);

    return safeUser;
  }
}
