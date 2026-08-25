import IORedis from "ioredis";
import { env } from "./config/env";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const userId =
  "48b7c448-6cde-40bd-bff6-279a0598f26a";

const hourWindow = Math.floor(
  Date.now() / 3_600_000,
);

const key =
  `email-rate-limit:${userId}:${hourWindow}`;

async function clearRateLimit() {
  const deleted = await redis.del(key);

  console.log("Redis key:", key);
  console.log("Deleted:", deleted);

  await redis.quit();
}

clearRateLimit().catch((error) => {
  console.error(error);
  process.exit(1);
});