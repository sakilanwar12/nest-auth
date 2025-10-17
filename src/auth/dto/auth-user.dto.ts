import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: '2025-10-14T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-14T12:00:00Z' })
  updatedAt: Date;
}
