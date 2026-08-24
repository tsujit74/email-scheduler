import {
    cancelCampaign,
  createCampaign,
  findCampaignById,
  findCampaignsByUserId,
} from "../repositories/campaignRepository";

type CreateCampaignInput = {
  subject: string;
  body: string;
  startTime: Date;
  delayBetweenEmails: number;
  hourlyLimit: number;
};

export async function createCampaignForUser(
  userId: string,
  input: CreateCampaignInput,
) {
  if (input.delayBetweenEmails < 0) {
    throw new Error("delayBetweenEmails cannot be negative");
  }

  if (input.hourlyLimit <= 0) {
    throw new Error("hourlyLimit must be greater than 0");
  }

  if (!input.subject.trim()) {
    throw new Error("Subject is required");
  }

  if (!input.body.trim()) {
    throw new Error("Body is required");
  }

  return createCampaign({
    userId,
    subject: input.subject.trim(),
    body: input.body,
    startTime: input.startTime,
    delayBetweenEmails: input.delayBetweenEmails,
    hourlyLimit: input.hourlyLimit,
  });
}

export async function getCampaignsForUser(userId: string) {
  return findCampaignsByUserId(userId);
}

export async function getCampaignForUser(
  userId: string,
  campaignId: string,
) {
  const campaign = await findCampaignById(campaignId);

  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found");
  }

  return campaign;
}

export async function cancelCampaignForUser(
  userId: string,
  campaignId: string,
) {
  const campaign = await findCampaignById(campaignId);

  if (!campaign || campaign.userId !== userId) {
    throw new Error("Campaign not found");
  }

  if (campaign.status === "completed") {
    throw new Error("Completed campaign cannot be cancelled");
  }

  if (campaign.status === "cancelled") {
    throw new Error("Campaign is already cancelled");
  }

  return cancelCampaign(campaignId);
}