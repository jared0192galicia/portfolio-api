import { z, ZodError } from 'zod';

// Esquema para las variables de entorno
const EnvSchema = z.object({
  MODE: z.string().default('development'),
  PORT: z.coerce.number().default(3001),
  PRODUCTION_URL: z.string().default('https://www.api.devjared.com/'),
  CORS_ORIGIN: z.string().default('http://0.0.0.0:3001'),
  ACCESS_TOKEN_SECRET: z.string(),
  JWT_EXPIRATION: z.number().default(2592000),
  POSTGRE_URL: z.string(),

  // seguridad
  MAX_LOGIN_ATTEMPS: z.coerce.number().default(5),
  LOGIN_ATTEMPTS_TIMEWINDOW_MINUTES: z.coerce.number().default(2),

  MAGICFETCH_GENERATE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  MAGICFETCH_OUTPUT_FILES: z
    .array(z.string())
    .default(['../portafolio-app/src/services'])
});

// Infer the environment type
export type env = z.infer<typeof EnvSchema>;

// Parse the environment variables from Bun.env
let env: env;

try {
  env = EnvSchema.parse(Bun.env);
} catch (e) {
  const error = e as ZodError;
  console.error('Invalid Env:');
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
