import { CalendarClock, Mail } from "lucide-react";
import type { EmailDetail } from "@/types/email";
import EmailStatus from "./EmailStatus";

type EmailMetadataProps = {
  email: EmailDetail;
};

function getValidDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string | null) {
  const date = getValidDate(value);

  if (!date) return "Date unavailable";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EmailMetadata({ email }: EmailMetadataProps) {
  const senderName = email.campaign?.user?.name || "Sender";
  const senderEmail = email.campaign?.user?.email || "Unknown sender";
  const displayDate =
    email.status === "sent" ? email.sentAt : email.scheduledAt;

  return (
    <section className="border-b border-gray-100 px-5 py-7 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00b341]/10 text-[#00b341]">
            <Mail size={20} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm font-semibold text-gray-900">
                {senderName}
              </p>

              <span className="hidden text-gray-300 sm:inline">•</span>

              <p className="max-w-full truncate text-sm text-gray-500">
                {senderEmail}
              </p>
            </div>

            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-400">To</span>
              <span className="font-medium text-gray-700">me</span>
              <span className="text-gray-300">•</span>
              <span className="max-w-full truncate text-gray-500">
                {email.recipient}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <CalendarClock size={14} strokeWidth={1.8} />
              <span>{formatDate(displayDate)}</span>
            </div>
          </div>
        </div>

        <EmailStatus
          status={email.status}
          scheduledAt={email.scheduledAt}
          sentAt={email.sentAt}
          errorMessage={email.errorMessage}
        />
      </div>
    </section>
  );
}