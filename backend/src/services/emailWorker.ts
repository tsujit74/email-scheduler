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
      console.log(
        `Skipping already sent email ${email.id}`,
      );
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
      console.log(
        `Skipping email ${email.id}: campaign cancelled`,
      );
      return;
    }

    // --------------------------------------------------
    // USER / TENANT HOURLY RATE LIMIT
    // --------------------------------------------------

    const rateLimit = await consumeEmailSlot(
      campaign.user.id,
      campaign.user.hourlyEmailLimit,
    );

    if (!rateLimit.allowed) {
      console.log(
        `Hourly limit reached for user ${campaign.user.id}. ` +
          `Email ${email.id} will be retried in ` +
          `${rateLimit.retryAfterSeconds}s.`,
      );

      /*
       * Throwing here means the email is NOT marked as
       * processing and SMTP is NOT called.
       *
       * We use BullMQ retry/backoff to retry the job.
       */
      throw new Error(
        `EMAIL_RATE_LIMIT:${rateLimit.retryAfterSeconds}`,
      );
    }

    // --------------------------------------------------
    // MARK EMAIL AS PROCESSING
    // --------------------------------------------------

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
      // ------------------------------------------------
      // SEND EMAIL
      // ------------------------------------------------

      const result = await sendEmail(
        email.recipient,
        email.subject,
        email.body,
      );

      // ------------------------------------------------
      // MARK EMAIL AS SENT
      // ------------------------------------------------

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

      console.log(
        `Email sent: ${email.recipient}`,
      );

      // ------------------------------------------------
      // UPDATE CAMPAIGN STATUS
      // ------------------------------------------------

      const pendingEmails =
        await countPendingEmails(
          email.campaignId,
        );

      if (pendingEmails === 0) {
        await updateCampaignStatus(
          email.campaignId,
          "completed",
        );
      } else {
        await updateCampaignStatus(
          email.campaignId,
          "processing",
        );
      }

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

      console.error(
        `Failed to send email to ${email.recipient} ` +
          `(attempt ${currentAttempt}/${maxAttempts}): ` +
          errorMessage,
      );

      if (isFinalAttempt) {
        const pendingEmails =
          await countPendingEmails(
            email.campaignId,
          );

        if (pendingEmails === 0) {
          await updateCampaignStatus(
            email.campaignId,
            "completed",
          );
        } else {
          await updateCampaignStatus(
            email.campaignId,
            "processing",
          );
        }
      }

      throw error;
    }
  },
  {
    connection: workerConnection,

    // Configurable concurrency
    concurrency: env.WORKER_CONCURRENCY,
  },
);

emailWorker.on("completed", (job) => {
  console.log(
    `Job ${job.id} completed`,
  );
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id ?? "unknown"} failed:`,
    error.message,
  );
});