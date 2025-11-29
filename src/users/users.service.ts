import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUser } from './users.interface';
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
