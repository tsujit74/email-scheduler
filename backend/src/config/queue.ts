import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "./env";

const queueConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("email-sending", {
  connection: queueConnection,
});
