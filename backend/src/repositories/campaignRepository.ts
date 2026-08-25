import { prisma } from "../config/prisma";

type CreateCampaignData = {
  userId: string;
  subject: string;
  body: string;
  startTime: Date;
  delayBetweenEmails: number;
};

export async function createCampaign(
  data: CreateCampaignData,
) {
  return prisma.campaign.create({
    data,
  });
}

export async function findCampaignById(
  id: string,
) {
  return prisma.campaign.findUnique({
    where: {
      id,
    },
    include: {
      emails: true,
    },
  });
}

export async function findCampaignsByUserId(
  userId: string,
) {
  return prisma.campaign.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateCampaignStatus(
  id: string,
  status:
    | "scheduled"
    | "processing"
    | "completed"
    | "cancelled",
) {
  return prisma.campaign.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

export async function cancelCampaign(
  id: string,
) {
  return prisma.campaign.update({
    where: {
      id,
    },
    data: {
      status: "cancelled",
    },
  });
}