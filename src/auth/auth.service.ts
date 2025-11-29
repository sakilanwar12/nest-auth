import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ISafeAuthUser } from './entities/auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { envVar } from 'src/config/envVar';

import { refreshTokenSchemaDto } from './schemas/login-user-schema';
import { JwtPayload } from './types';
import { omitKeys } from 'js-utility-method';
import PasswordUtils from 'src/lib/utils/password-utils';
import { JwtUtils } from 'src/lib/utils/jwt.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  /**
   * Create a new user
   */
  async create(createUserDto: CreateAuthDto): Promise<ISafeAuthUser> {
    const { name, email, password, role } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = {
      name,
      email,
      password: await PasswordUtils.hash(password),
      role,
    };

    const createdUser = await this.prisma.user.create({
      data: user,
    });

    return omitKeys(createdUser, ['password']);
  }
  /**
   * Login a user
   * @param dto 
   * @returns 
   */
  async login(dto: { email: string; password: string }) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtils.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: String(user.id), email: user.email, role: user.role };
    const accessToken = await JwtUtils.accessToken(payload);
    const refreshToken = await JwtUtils.refreshToken(payload);

    const loggedInUser = omitKeys(user, ['password']);
    const result = {
      ...loggedInUser,
      accessToken,
      refreshToken,
    };
    return result;
  }
  async refreshToken(dto: refreshTokenSchemaDto) {
    const { refreshToken } = dto;

    try {
      const payload = await JwtUtils.verifyRefreshToken(refreshToken);

      // Remove iat and exp by destructuring
      const { iat, exp, ...data } = payload;

      const accessToken = await JwtUtils.accessToken(data);

      return { accessToken, refreshToken };
    } catch (err: unknown) {
      // Optional: narrow the error for logging
      if (err instanceof Error) {
        console.error('Refresh token error:', err.message);
      }

      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
