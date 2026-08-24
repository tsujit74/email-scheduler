export type EmailStatus =
   "scheduled"
   "processing"
   "sent"
   "failed";

export interface Email {
  id: string;
  campaignId: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt?: string | null;
  status: EmailStatus;
  attempts: number;
  providerMessageId?: string | null;
  idempotencyKey: string;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}