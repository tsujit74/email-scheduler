import { Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { sendEmail } from "./emailSender";

const workerConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const emailWorker = new Worker(
  "email-sending",
  async (job) => {
    const { emailId } = job.data;

    const email = await prisma.email.findUnique({
      where: {
        id: emailId,
      },
    });

    if (!email) {
      throw new Error(`Email ${emailId} not found`);
    }

    // Prevent sending the same email again.
    if (email.status === "sent") {
      return;
    }

    await prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        status: "processing",
        attempts: {
          increment: 1,
        },
      },
    });

    try {
      const result = await sendEmail(
        email.recipient,
        email.subject,
        email.body,
      );

      await prisma.email.update({
        where: {
          id: email.id,
        },
        data: {
          status: "sent",
          sentAt: new Date(),
          providerMessageId: result.messageId,
          errorMessage: null,
        },
      });

      console.log(`Email sent: ${email.recipient}`);

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown email error";

      await prisma.email.update({
        where: {
          id: email.id,
        },
        data: {
          status: "failed",
          errorMessage,
        },
      });

      console.error(
        `Failed to send email to ${email.recipient}:`,
        errorMessage,
      );

      throw error;
    }
  },
  {
    connection: workerConnection,
    concurrency: env.WORKER_CONCURRENCY,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id ?? "unknown"} failed:`,
    error.message,
  );
});