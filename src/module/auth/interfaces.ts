import { z } from '@hono/zod-openapi';

export const schemaSignup = z.object({
  name: z.string().min(3),
  surname: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
});

export const schemaToken = z.object({
  accessToken: z.string()
});

export const schemaLogin = z.object({
  identifier: z.string(),
  password: z.string()
});
