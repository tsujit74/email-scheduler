import { Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { sendEmail } from "./emailSender";

import { updateCampaignStatus } from "../repositories/campaignRepository";
import { countPendingEmails } from "../repositories/emailRepository";

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

    if (email.status === "sent") {
      return;
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: email.campaignId,
      },
    });

    if (!campaign) {
      throw new Error(`Campaign ${email.campaignId} not found`);
    }

    if (campaign.status === "cancelled") {
      console.log(`Skipping email ${email.id}: campaign cancelled`);

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

      const pendingEmails = await countPendingEmails(email.campaignId);

      if (pendingEmails === 0) {
        await updateCampaignStatus(email.campaignId, "completed");
      } else {
        await updateCampaignStatus(email.campaignId, "processing");
      }

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown email error";

      const maxAttempts = job.opts.attempts ?? 1;

      const currentAttempt = job.attemptsMade + 1;

      const isFinalAttempt = currentAttempt >= maxAttempts;

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
        `Failed to send email to ${email.recipient} ` +
          `(attempt ${currentAttempt}/${maxAttempts}):`,
        errorMessage,
      );

      if (isFinalAttempt) {
        console.error(
          `Email ${email.id} permanently failed after ${maxAttempts} attempts`,
        );
      }

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
  console.error(`Job ${job?.id ?? "unknown"} failed:`, error.message);
});
