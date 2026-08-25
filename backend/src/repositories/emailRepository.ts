import { prisma } from "../config/prisma";

type CreateEmailData = {
  campaignId: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: Date;
  idempotencyKey: string;
};

export async function createEmail(
  data: CreateEmailData,
) {
  return prisma.email.create({
    data,
  });
}

export async function createManyEmails(
  data: CreateEmailData[],
) {
  return prisma.email.createMany({
    data,
    skipDuplicates: true,
  });
}

export async function findEmailsByCampaignId(
  campaignId: string,
) {
  return prisma.email.findMany({
    where: {
      campaignId,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });
}

export async function countPendingEmails(
  campaignId: string,
) {
  return prisma.email.count({
    where: {
      campaignId,
      status: {
        in: ["scheduled", "processing"],
      },
    },
  });
}

export async function findEmailById(
  emailId: string,
) {
  return prisma.email.findUnique({
    where: {
      id: emailId,
    },
    include: {
      campaign: {
        include: {
          user: true,
        },
      },
    },
  });
}