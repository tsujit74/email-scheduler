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
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-400">Loading emails...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-base font-medium text-gray-700">No emails</p>

          <p className="mt-1 text-sm text-gray-400">
            Your emails will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
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
