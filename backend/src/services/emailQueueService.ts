import { emailQueue } from "../config/queue";

export async function queueEmail(emailId: string, scheduledAt: Date) {
  const delay = Math.max(0, scheduledAt.getTime() - Date.now());

  return emailQueue.add(
    "send-email",
    {
      emailId,
    },
    {
      // One BullMQ job per email.
      // Prevents the same email from being queued twice.
      jobId: emailId,

      // Persistent delayed scheduling.
      delay,

      // Retry actual SMTP failures.
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
