import {
    cancelCampaign,
  createCampaign,
  findCampaignById,
  findCampaignsByUserId,
} from "../repositories/campaignRepository";
import { AppError } from "../utils/AppError";

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
  throw new AppError("Campaign not found", 404);
}

if (campaign.status === "completed") {
  throw new AppError(
    "Completed campaign cannot be cancelled",
    409,
  );
}

if (campaign.status === "cancelled") {
  throw new AppError(
    "Campaign is already cancelled",
    409,
  );
}

  return cancelCampaign(campaignId);
}