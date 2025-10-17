import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    example: 'Sakil Anwar',
    description: 'Full name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}
