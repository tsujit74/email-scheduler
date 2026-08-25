"use client";

import {
  Archive,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";

type Props = {
  onStar?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
};

export default function EmailActions({
  onStar,
  onArchive,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onStar}
        aria-label="Star email"
        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <Star className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onArchive}
        aria-label="Archive email"
        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <Archive className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete email"
        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="More actions"
        className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}