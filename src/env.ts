import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_KEY: z.string(),
  PORT: z.coerce.number(),
  HOST: z.string(),
  ACCESS_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
