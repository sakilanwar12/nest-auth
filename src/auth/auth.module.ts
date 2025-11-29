import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { envVar } from 'src/config/envVar';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: envVar.NEST_AUTH_ACCESS_TOKEN_SECRET as string,
      signOptions: {
        expiresIn: envVar.NEST_AUTH_ACCESS_TOKEN_EXPIRES_IN as number, 
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
