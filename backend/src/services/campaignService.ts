import {
  cancelCampaign,
  createCampaign,
  findCampaignById,
  findCampaignsByUserId,
} from "../repositories/campaignRepository";

import { prisma } from "../config/prisma";
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
  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  if (input.delayBetweenEmails < 0) {
    throw new AppError(
      "delayBetweenEmails cannot be negative",
      400,
    );
  }

  if (input.hourlyLimit <= 0) {
    throw new AppError(
      "hourlyLimit must be greater than 0",
      400,
    );
  }

  if (!input.subject.trim()) {
    throw new AppError(
      "Subject is required",
      400,
    );
  }

  if (!input.body.trim()) {
    throw new AppError(
      "Body is required",
      400,
    );
  }

  if (Number.isNaN(input.startTime.getTime())) {
    throw new AppError(
      "Invalid startTime",
      400,
    );
  }

  // --------------------------------------------------
  // VERIFY USER
  // --------------------------------------------------

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  // --------------------------------------------------
  // UPDATE USER HOURLY LIMIT
  // --------------------------------------------------
  //
  // hourlyLimit belongs to the USER/TENANT.
  //
  // This means:
  //
  // User A
  // ├── Campaign 1
  // ├── Campaign 2
  // └── Campaign 3
  //
  // All campaigns share the same hourly limit.
  //
  // --------------------------------------------------

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      hourlyEmailLimit: input.hourlyLimit,
    },
  });

  // --------------------------------------------------
  // CREATE CAMPAIGN
  // --------------------------------------------------

  return createCampaign({
    userId,
    subject: input.subject.trim(),
    body: input.body,
    startTime: input.startTime,
    delayBetweenEmails: input.delayBetweenEmails,
  });
}

export async function getCampaignsForUser(
  userId: string,
) {
  return findCampaignsByUserId(userId);
}

export async function getCampaignForUser(
  userId: string,
  campaignId: string,
) {
  const campaign = await findCampaignById(
    campaignId,
  );

  if (
    !campaign ||
    campaign.userId !== userId
  ) {
    throw new AppError(
      "Campaign not found",
      404,
    );
  }

  return campaign;
}

export async function cancelCampaignForUser(
  userId: string,
  campaignId: string,
) {
  const campaign = await findCampaignById(
    campaignId,
  );

  if (
    !campaign ||
    campaign.userId !== userId
  ) {
    throw new AppError(
      "Campaign not found",
      404,
    );
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