import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ISafeAuthUser } from './entities/auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { envVar } from 'src/config/envVar';
import * as bcrypt from 'bcrypt';
import { omit } from 'src/lib/utils/omit';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateAuthDto): Promise<ISafeAuthUser> {
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
