"use client";

type DashboardHeaderProps = {
  activeView: "scheduled" | "sent";
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
};

export default function DashboardHeader({
  activeView,
  search,
  onSearchChange,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {activeView === "scheduled"
            ? "Scheduled Emails"
            : "Sent Emails"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {activeView === "scheduled"
            ? "Emails waiting to be sent"
            : "Emails that have already been sent"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          className="h-11 w-[240px] rounded-xl bg-gray-100 px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#00b341]/20"
        />

        <button
          type="button"
          className="h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          Filter
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="h-11 rounded-xl border border-gray-200 px-4 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}