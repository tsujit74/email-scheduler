"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LoaderCircle,
} from "lucide-react";

type EmailStatus = "scheduled" | "processing" | "sent" | "failed";

type EmailRowProps = {
  recipient: string;
  subject: string;
  body: string;
  status: EmailStatus;
  scheduledAt?: string | Date | null;
  sentAt?: string | Date | null;
  onClick?: () => void;
};

const statusStyles: Record<
  EmailStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3,
  },

  processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: LoaderCircle,
  },

  sent: {
    label: "Sent",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },

  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: AlertCircle,
  },
};

function getValidDate(value?: string | Date | null) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatEmailDate(value?: string | Date | null) {
  const date = getValidDate(value);

  if (!date) {
    return {
      date: "No date",
      time: "",
    };
  }

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date),

    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date),
  };
}

function getInitials(email: string) {
  return email.trim().charAt(0).toUpperCase() || "?";
}

export default function EmailRow({
  recipient,
  subject,
  body,
  status,
  scheduledAt,
  sentAt,
  onClick,
}: EmailRowProps) {
  const date = status === "sent" ? sentAt : scheduledAt;

  const formattedDate = formatEmailDate(date);
  const statusConfig = statusStyles[status];
  const StatusIcon = statusConfig.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-b border-gray-100 px-5 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#00b341]/20 sm:px-6"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00b341]/10 text-xs font-semibold text-[#00b341]">
        {getInitials(recipient)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-[15px] font-semibold text-gray-900">
            {recipient}
          </p>

          <span
            className={`hidden shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset sm:inline-flex ${statusConfig.className}`}
          >
            <StatusIcon
              className={`h-2.5 w-2.5 ${
                status === "processing" ? "animate-spin" : ""
              }`}
              strokeWidth={2}
            />

            {statusConfig.label}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          <p className="truncate text-[14px] font-medium text-gray-700">
            {subject || "No subject"}
          </p>

          <span className="hidden text-xs text-gray-300 sm:inline">-</span>

          <p className="hidden min-w-0 truncate text-xs text-gray-400 sm:block">
            {body || "No message preview"}
          </p>
        </div>

        <span
          className={`mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset sm:hidden ${statusConfig.className}`}
        >
          <StatusIcon
            className={`h-2.5 w-2.5 ${
              status === "processing" ? "animate-spin" : ""
            }`}
            strokeWidth={2}
          />

          {statusConfig.label}
        </span>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-[11px] font-medium text-gray-600">
          {formattedDate.date}
        </p>

        <p className="text-[10px] text-gray-400">{formattedDate.time}</p>
      </div>

      <ArrowRight
        className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500"
        strokeWidth={1.8}
      />
    </button>
  );
}
