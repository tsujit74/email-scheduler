import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),

  DEFAULT_EMAIL_DELAY_MS: z.coerce.number().int().nonnegative().default(2000),

  MAX_EMAILS_PER_HOUR: z.coerce.number().int().positive().default(200),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  GOOGLE_CALLBACK_URL: z.url("GOOGLE_CALLBACK_URL must be a valid URL"),

  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),

    
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");

  for (const issue of parsedEnv.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = parsedEnv.data;
