type EmailRowProps = {
  recipient: string;
  subject: string;
  body: string;
  status: "scheduled" | "processing" | "sent" | "failed";
  scheduledAt?: string | Date | null;
  sentAt?: string | Date | null;
  onClick?: () => void;
};

function formatDate(date?: string | Date | null) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getStatusLabel(status: EmailRowProps["status"]) {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "processing":
      return "Processing";
    case "sent":
      return "Sent";
    case "failed":
      return "Failed";
    default:
      return status;
  }
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

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-5 border-b border-gray-100 px-5 py-5 text-left transition hover:bg-gray-50"
    >
      <div className="w-[220px] shrink-0">
        <p className="truncate text-sm font-medium text-gray-900">
          To: {recipient}
        </p>

        <p className="mt-1 truncate text-xs text-gray-400">
          {formatDate(date)}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              status === "sent"
                ? "bg-green-50 text-green-600"
                : status === "failed"
                  ? "bg-red-50 text-red-600"
                  : status === "processing"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-600"
            }`}
          >
            {getStatusLabel(status)}
          </span>

          <p className="truncate text-sm font-medium text-gray-900">
            {subject}
          </p>
        </div>

        <p className="mt-1 truncate text-sm text-gray-400">{body}</p>
      </div>

      <span className="shrink-0 text-xl text-gray-300" aria-hidden="true">
        ☆
      </span>
    </button>
  );
}
