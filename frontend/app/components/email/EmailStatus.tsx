import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import type { EmailStatus as EmailStatusType } from "@/types/email";

type Props = {
  status: EmailStatusType;
  scheduledAt?: string | null;
  sentAt?: string | null;
  errorMessage?: string | null;
};

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function EmailStatus({
  status,
  scheduledAt,
  sentAt,
  errorMessage,
}: Props) {
  if (status === "sent") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Sent</span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Sent {formatDate(sentAt)}
        </p>
      </div>
    );
  }

  if (status === "scheduled") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
          <Clock3 className="h-4 w-4" />
          <span>Scheduled</span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Scheduled for {formatDate(scheduledAt)}
        </p>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <Clock3 className="h-4 w-4" />
          <span>Processing</span>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-red-600">
          <XCircle className="h-4 w-4" />
          <span>Failed</span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Failed to send
        </p>

        {errorMessage && (
          <p className="mt-1 max-w-sm text-sm text-red-500">
            Reason: {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return null;
}