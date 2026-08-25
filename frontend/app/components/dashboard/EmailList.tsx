"use client";

import { Inbox } from "lucide-react";

import EmailRow from "./EmailRow";

export type DashboardEmail = {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt?: string | null;
  status: "scheduled" | "processing" | "sent" | "failed";
  attempts?: number;
  errorMessage?: string | null;
};

type EmailListProps = {
  emails: DashboardEmail[];
  loading: boolean;
  onEmailClick: (email: DashboardEmail) => void;
};

export default function EmailList({
  emails,
  loading,
  onEmailClick,
}: EmailListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-5 py-4 sm:px-6"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded bg-gray-100" />
            </div>

            <div className="hidden h-3 w-24 animate-pulse rounded bg-gray-100 sm:block" />
          </div>
        ))}
      </div>
    );
  }

  if (!emails.length) {
    return (
      <div className="flex min-h-[360px] items-center justify-center px-6">
        <div className="max-w-xs text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
            <Inbox
              className="h-5 w-5 text-gray-400"
              strokeWidth={1.8}
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            No emails yet
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-400">
            Your scheduled and sent emails will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {emails.map((email) => (
        <EmailRow
          key={email.id}
          recipient={email.recipient}
          subject={email.subject}
          body={email.body}
          status={email.status}
          scheduledAt={email.scheduledAt}
          sentAt={email.sentAt}
          onClick={() => onEmailClick(email)}
        />
      ))}
    </div>
  );
}