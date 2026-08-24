import type { Email } from "./email";
export type CampaignStatus =
  "scheduled"
  "processing"
  "completed"
  "cancelled";

export interface Campaign {
  id: string;
  userId: string;
  subject: string;
  body: string;
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  emails?: Email[];
}

export interface CreateCampaignInput {
  subject: string;
  body: string;
  startTime: string;
  delayBetweenEmails: number;
  hourlyLimit: number;
}