"use client";

import type { User } from "@/types/auth";

type SidebarProps = {
  user: User | null;
  activeView: "scheduled" | "sent";
  onViewChange: (view: "scheduled" | "sent") => void;
  scheduledCount: number;
  sentCount: number;
  onCompose: () => void;
};

export default function Sidebar({
  user,
  activeView,
  onViewChange,
  scheduledCount,
  sentCount,
  onCompose,
}: SidebarProps) {
  const initials =
    user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <aside className="w-[260px] shrink-0 border-r border-gray-200 px-6 py-7">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        OUTBOX
      </h1>

      <div className="mt-10 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="truncate text-xs text-gray-500">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      {/* Compose */}
      <button
        type="button"
        onClick={onCompose}
        className="mt-8 w-full rounded-xl bg-[#00b341] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#00a63c]"
      >
        + Compose
      </button>

      {/* Navigation */}
      <nav className="mt-8 space-y-2">
        <button
          type="button"
          onClick={() => onViewChange("scheduled")}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
            activeView === "scheduled"
              ? "bg-gray-100 font-semibold text-gray-900"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span>Scheduled</span>

          <span className="text-xs text-gray-400">
            {scheduledCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange("sent")}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition ${
            activeView === "sent"
              ? "bg-gray-100 font-semibold text-gray-900"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <span>Sent</span>

          <span className="text-xs text-gray-400">
            {sentCount}
          </span>
        </button>
      </nav>
    </aside>
  );
}