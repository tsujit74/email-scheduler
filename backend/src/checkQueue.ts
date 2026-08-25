import { emailQueue } from "./config/queue";

async function checkQueue() {
  const jobs = await emailQueue.getJobs([
    "waiting",
    "active",
    "delayed",
    "failed",
    "completed",
  ]);

  for (const job of jobs) {
    console.log({
      id: job.id,
      name: job.name,
      data: job.data,
      state: await job.getState(),
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      delay: job.delay,
    });
  }

  await emailQueue.close();
}

checkQueue().catch(console.error);