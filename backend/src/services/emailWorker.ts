import { Worker } from "bullmq";
import IORedis from "ioredis";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { sendEmail } from "./emailSender";
import { consumeEmailSlot } from "./rateLimit";

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

    // Idempotency protection
    if (email.status === "sent") {
      return;
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: email.campaignId,
      },
      include: {
        user: true,
      },
    });

    if (!campaign) {
      throw new Error(
        `Campaign ${email.campaignId} not found`,
      );
    }

    // Do not send cancelled campaigns
    if (campaign.status === "cancelled") {
      return;
    }

    const rateLimit = await consumeEmailSlot(
      campaign.user.id,
      campaign.user.hourlyEmailLimit,
    );

    if (!rateLimit.allowed) {
      const delayMs =
        rateLimit.retryAfterSeconds * 1000;

      const nextAvailableTime =
        Date.now() + delayMs;

      await prisma.email.update({
        where: {
          id: email.id,
        },
        data: {
          scheduledAt: new Date(nextAvailableTime),
          status: "scheduled",
        },
      });

      await job.moveToDelayed(
        nextAvailableTime,
        job.token,
      );

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

      const pendingEmails =
        await countPendingEmails(email.campaignId);

      await updateCampaignStatus(
        email.campaignId,
        pendingEmails === 0
          ? "completed"
          : "processing",
      );

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown email error";

      const maxAttempts =
        job.opts.attempts ?? 1;

      const currentAttempt =
        job.attemptsMade + 1;

      const isFinalAttempt =
        currentAttempt >= maxAttempts;

      await prisma.email.update({
        where: {
          id: email.id,
        },
        data: {
          status: "failed",
          errorMessage,
        },
      });

      if (isFinalAttempt) {
        const pendingEmails =
          await countPendingEmails(email.campaignId);

        await updateCampaignStatus(
          email.campaignId,
          pendingEmails === 0
            ? "completed"
            : "processing",
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

emailWorker.on("completed", () => {
  // Job completed successfully.
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `[WORKER] Job ${job?.id ?? "unknown"} failed:`,
    error.message,
  );
});

emailWorker.on("error", (error) => {
  console.error("[WORKER] Worker error:", error);
});