import { randomUUID } from "node:crypto";

import { findCampaignById } from "../repositories/campaignRepository";
import {
  createEmail,
  findEmailById,
  findEmailsByCampaignId,
} from "../repositories/emailRepository";

import { queueEmail } from "./emailQueueService";
import { calculateScheduledAt } from "../utils/emailScheduling";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";

type CreateEmailsInput = {
  recipients: string[];
};

export async function addEmailsToCampaign(
  userId: string,
  campaignId: string,
  input: CreateEmailsInput,
) {
  const campaign = await findCampaignById(campaignId);

  if (!campaign || campaign.userId !== userId) {
    throw new AppError("Campaign not found", 404);
  }

  if (!input.recipients.length) {
    throw new AppError(
      "At least one recipient is required",
      400,
    );
  }

  // Normalize emails
  const recipients = input.recipients
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  // Remove duplicates from the current request
  const uniqueRecipients = [...new Set(recipients)];

  // Find recipients that already exist in this campaign
  const existingEmails = await prisma.email.findMany({
    where: {
      campaignId: campaign.id,
      recipient: {
        in: uniqueRecipients,
      },
    },
    select: {
      recipient: true,
    },
  });

  const existingRecipients = new Set(
    existingEmails.map((email) => email.recipient),
  );

  // Only create genuinely new recipients
  const newRecipients = uniqueRecipients.filter(
    (recipient) => !existingRecipients.has(recipient),
  );

  if (!newRecipients.length) {
    return [];
  }

  const emails = newRecipients.map((recipient, index) => ({
    campaignId: campaign.id,
    recipient,
    subject: campaign.subject,
    body: campaign.body,
    scheduledAt: calculateScheduledAt(
      campaign.startTime,
      index,
      campaign.delayBetweenEmails,
    ),
    idempotencyKey: randomUUID(),
  }));

  const createdEmails = [];

  for (const email of emails) {
    const createdEmail = await createEmail(email);

    createdEmails.push(createdEmail);

    await queueEmail(
      createdEmail.id,
      createdEmail.scheduledAt,
    );
  }

  return createdEmails;
}

// --------------------------------------------------
// GET CAMPAIGN EMAILS
// --------------------------------------------------

export async function getCampaignEmails(
  userId: string,
  campaignId: string,
) {
  const campaign =
    await findCampaignById(campaignId);

  if (
    !campaign ||
    campaign.userId !== userId
  ) {
    throw new AppError(
      "Campaign not found",
      404,
    );
  }

  return findEmailsByCampaignId(
    campaignId,
  );
}

// --------------------------------------------------
// GET EMAIL
// --------------------------------------------------

export async function getEmailById(
  userId: string,
  emailId: string,
) {
  const email =
    await findEmailById(emailId);

  if (
    !email ||
    email.campaign.userId !== userId
  ) {
    throw new AppError(
      "Email not found",
      404,
    );
  }

  return email;
}