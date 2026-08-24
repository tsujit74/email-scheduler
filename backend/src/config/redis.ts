import { createClient } from "redis";
import { env } from "./env";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis client error:", error);
});

export function createRedisClient() {
  const client = createClient({
    url: env.REDIS_URL,
  });

  client.on("error", (error) => {
    console.error("Redis client error:", error);
  });

  return client;
}