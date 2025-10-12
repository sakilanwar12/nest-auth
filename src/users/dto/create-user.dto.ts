import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { IUser } from '../users.interface';

export class CreateUserDto implements Partial<IUser> {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
