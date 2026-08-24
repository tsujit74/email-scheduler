import { Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";

const workerConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const emailWorker = new Worker(
  "email-sending",
  async (job) => {
    console.log("Processing email job:", job.id);
    console.log("Email ID:", job.data.emailId);

    // SMTP sending will be implemented next.
  },
  {
    connection: workerConnection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Email job ${job?.id ?? "unknown"} failed:`,
    error,
  );
});