import { Mail } from "lucide-react";

import type { EmailDetail } from "@/types/email";

import EmailStatus from "./EmailStatus";

type Props = {
  email: EmailDetail;
};

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function EmailMetadata({ email }: Props) {
  const senderName = email.campaign?.user?.name ?? "Sender";
  const senderEmail = email.campaign?.user?.email ?? "—";

  const date =
    email.status === "sent"
      ? formatDate(email.sentAt)
      : formatDate(email.scheduledAt);

  return (
    <section className="border-b border-gray-100 px-5 py-7 sm:px-7 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
            <Mail
              className="h-[18px] w-[18px] text-gray-500"
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
                {senderName}
              </p>

              <div className="flex min-w-0 items-center gap-1.5 text-sm text-gray-400">
                <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span className="truncate">{senderEmail}</span>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-sm">
              <span className="text-gray-400">to</span>

              <span className="font-medium text-gray-700">me</span>

              <span className="text-gray-300">·</span>

              <span className="truncate text-gray-400">{email.recipient}</span>
            </div>

            <p className="mt-2 text-xs text-gray-400">{date}</p>
          </div>
        </div>

        <div className="lg:pt-0.5">
          <EmailStatus
            status={email.status}
            scheduledAt={email.scheduledAt}
            sentAt={email.sentAt}
            errorMessage={email.errorMessage}
          />
        </div>
      </div>
    </section>
  );
}
