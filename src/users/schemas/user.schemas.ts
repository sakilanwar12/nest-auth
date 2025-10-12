// users/schemas/user.schemas.ts
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string().optional().default('user'),
});

// ✅ Must extend createZodDto
export class CreateUserDto extends createZodDto(UserSchema) {}
