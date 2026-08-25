import IORedis from "ioredis";
import { env } from "../config/env";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const HOUR_IN_SECONDS = 60 * 60;

const CONSUME_SLOT_SCRIPT = `
  local current = redis.call("GET", KEYS[1])

  if current and tonumber(current) >= tonumber(ARGV[1]) then
    return 0
  end

  local count = redis.call("INCR", KEYS[1])

  if count == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[2])
  end

  return 1
`;

export async function consumeEmailSlot(
  userId: string,
  hourlyLimit: number,
): Promise<{
  allowed: boolean;
  retryAfterSeconds: number;
}> {
  const now = new Date();

  const hourWindow = Math.floor(
    now.getTime() / 3_600_000,
  );

  const key = `email-rate-limit:${userId}:${hourWindow}`;

  const result = await redis.eval(
    CONSUME_SLOT_SCRIPT,
    1,
    key,
    hourlyLimit,
    HOUR_IN_SECONDS,
  );

  if (Number(result) === 1) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  const nextHour = new Date(
    (hourWindow + 1) * 3_600_000,
  );

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(
      (nextHour.getTime() - now.getTime()) / 1000,
    ),
  );

  return {
    allowed: false,
    retryAfterSeconds,
  };
}