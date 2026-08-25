"use client";

import {
  Archive,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";

type EmailActionsProps = {
  onStar?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
};

type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  destructive?: boolean;
};

function ActionButton({
  label,
  onClick,
  children,
  destructive = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        "focus:outline-none focus:ring-4",
        destructive
          ? "text-gray-400 hover:bg-red-50 hover:text-red-600 focus:ring-red-100"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-800 focus:ring-gray-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function EmailActions({
  onStar,
  onArchive,
  onDelete,
  onMore,
}: EmailActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <ActionButton label="Star email" onClick={onStar}>
        <Star size={17} strokeWidth={1.8} />
      </ActionButton>

      <ActionButton label="Archive email" onClick={onArchive}>
        <Archive size={17} strokeWidth={1.8} />
      </ActionButton>

      <ActionButton label="Delete email" onClick={onDelete} destructive>
        <Trash2 size={17} strokeWidth={1.8} />
      </ActionButton>

      <ActionButton label="More actions" onClick={onMore}>
        <MoreHorizontal size={18} strokeWidth={1.8} />
      </ActionButton>
    </div>
  );
}