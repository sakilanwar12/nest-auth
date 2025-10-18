import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const loginUserSchema = z.object({
  email: z.email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string().optional().default('user'),
});

// ✅ Must extend createZodDto
export class loginUserSchemaDto extends createZodDto(loginUserSchema) {}
