import { emailQueue } from "../config/queue";

export async function queueEmail(emailId: string, scheduledAt: Date) {
  const delay = Math.max(
    0,
    scheduledAt.getTime() - Date.now(),
  );

  return emailQueue.add(
    "send-email",
    {
      emailId,
    },
    {
      jobId: emailId,
      delay,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 1000,
    },
  );
}