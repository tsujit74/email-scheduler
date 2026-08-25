"use client";

import Image from "next/image";
import { CalendarClock, FileCheck2, LogOut, MailPlus } from "lucide-react";

import type { User } from "@/types/auth";
import { logout } from "@/lib/api";
import { getInitials } from "@/lib/utils";

type SidebarProps = {
  user: User | null;
  activeView: "scheduled" | "sent";
  onViewChange: (view: "scheduled" | "sent") => void;
  scheduledCount: number;
  sentCount: number;
  onCompose: () => void;
};

const navigationItems = [
  {
    view: "scheduled" as const,
    label: "Scheduled",
    icon: CalendarClock,
  },
  {
    view: "sent" as const,
    label: "Sent",
    icon: FileCheck2,
  },
];

export default function Sidebar({
  user,
  activeView,
  onViewChange,
  scheduledCount,
  sentCount,
  onCompose,
}: SidebarProps) {
  const counts = {
    scheduled: scheduledCount,
    sent: sentCount,
  };

  async function handleLogout() {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        flex w-70 flex-col
        border-r border-gray-200
        bg-white
        px-4 py-5
      "
    >
      <div className="px-2">
        <p className="text-lg font-bold tracking-[0.18em] text-gray-900">
          OUTBOX
        </p>

        <p className="mt-0.5 text-[11px] text-gray-400">Email workspace</p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#00b341]/10 text-xs font-semibold text-[#00b341]">
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name || "User avatar"}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(user?.name)
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="truncate text-[11px] text-gray-500">
            {user?.email || "user@example.com"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCompose}
        className="
          mt-4 inline-flex h-10 w-full
          items-center justify-center gap-2
          rounded-lg bg-[#00b341]
          px-3 text-xs font-semibold text-white
          transition hover:bg-[#009c39]
          focus:outline-none
          focus:ring-4 focus:ring-[#00b341]/15
        "
      >
        <MailPlus size={16} strokeWidth={2} aria-hidden="true" />
        Compose email
      </button>

      <nav aria-label="Email navigation" className="mt-6 space-y-1">
        {navigationItems.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view;

          return (
            <button
              key={view}
              type="button"
              onClick={() => onViewChange(view)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs transition-colors",
                isActive
                  ? "bg-[#00b341]/10 font-semibold text-[#00b341]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              ].join(" ")}
            >
              <Icon
                size={16}
                strokeWidth={isActive ? 2.1 : 1.8}
                aria-hidden="true"
              />

              <span className="truncate">{label}</span>

              <span
                className={[
                  "ml-auto min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium",
                  isActive
                    ? "bg-white text-[#00b341]"
                    : "bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                {counts[view]}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full items-center gap-2.5
            rounded-lg px-3 py-2.5
            text-xs font-medium text-gray-500
            transition-colors
            hover:bg-red-50 hover:text-red-600
          "
        >
          <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
