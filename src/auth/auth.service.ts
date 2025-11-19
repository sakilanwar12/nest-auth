import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ISafeAuthUser } from './entities/auth.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { envVar } from 'src/config/envVar';
import * as bcrypt from 'bcrypt';
import { omit } from 'src/lib/utils/omit';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenSchemaDto } from './schemas/login-user-schema';
import { omitKeys } from 'js-utility-method';
export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }
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
  async login(dto: { email: string; password: string }) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user?.id, username: user?.name };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: envVar.NEST_AUTH_REFRESH_TOKEN_SECRET as string,
      expiresIn: envVar.NEST_AUTH_REFRESH_TOKEN_EXPIRES_IN as number,
    });

    const loggedInUser = omit(user, ['password']);
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
      const payload: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: envVar.NEST_AUTH_REFRESH_TOKEN_SECRET as string,
        },
      );

      // Remove iat and exp by destructuring
      const { iat, exp, ...data } = payload;

      const accessToken = await this.jwtService.signAsync(data, {
        secret: envVar.NEST_AUTH_ACCESS_TOKEN_SECRET as string,
        expiresIn: '15m',
      });

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
