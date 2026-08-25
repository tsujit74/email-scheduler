import IORedis from "ioredis";
import { env } from "./config/env";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

async function checkRateLimit() {
  const userId = "48b7c448-6cde-40bd-bff6-279a0598f26a";

  const hourWindow = Math.floor(
    Date.now() / 3_600_000,
  );

  const key = `email-rate-limit:${userId}:${hourWindow}`;

  const count = await redis.get(key);
  const ttl = await redis.ttl(key);

  console.log("User:", userId);
  console.log("Redis key:", key);
  console.log("Emails consumed this hour:", count);
  console.log("TTL:", ttl, "seconds");

  await redis.quit();
}

checkRateLimit().catch((error) => {
  console.error(error);
  process.exit(1);
});