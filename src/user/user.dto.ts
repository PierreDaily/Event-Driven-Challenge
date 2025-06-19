import { z } from 'zod/v3';
import { createZodDto } from 'nestjs-zod';
const createUserSchema = z.object({ email: z.string().email() });

export class CreateUserDto extends createZodDto(createUserSchema) {}
