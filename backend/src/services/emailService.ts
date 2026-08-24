import { randomUUID } from "node:crypto";
import { findCampaignById } from "../repositories/campaignRepository";
import {
  createEmail,
  findEmailsByCampaignId,
} from "../repositories/emailRepository";
import { queueEmail } from "./emailQueueService";
import { calculateScheduledAt } from "../utils/emailScheduling";

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
    throw new Error("Campaign not found");
  }

  if (!input.recipients.length) {
    throw new Error("At least one recipient is required");
  }

  const recipients = input.recipients.map((email) =>
    email.trim().toLowerCase(),
  );

  const uniqueRecipients = [...new Set(recipients)];

  const emails = uniqueRecipients.map((recipient, index) => ({
    campaignId: campaign.id,
    recipient,
    subject: campaign.subject,
    body: campaign.body,
    scheduledAt: calculateScheduledAt(
      campaign.startTime,
      index,
      campaign.delayBetweenEmails,
      campaign.hourlyLimit,
    ),
    idempotencyKey: randomUUID(),
  }));

  const createdEmails = [];

  for (const email of emails) {
    const createdEmail = await createEmail(email);

    createdEmails.push(createdEmail);

    await queueEmail(createdEmail.id, createdEmail.scheduledAt);
  }

  return createdEmails;
}

export async function getCampaignEmails(userId: string, campaignId: string) {
  const campaign = await findCampaignById(campaignId);

  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found");
  }

  return findEmailsByCampaignId(campaignId);
}
