"use client";

import { FormEvent } from "react";
import { Filter, RefreshCw, Search } from "lucide-react";

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
  const isScheduled = activeView === "scheduled";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section>
     
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>

          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-gray-900">
            {isScheduled ? "Scheduled Emails" : "Sent Emails"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isScheduled
              ? "Emails waiting to be sent."
              : "Emails that have already been sent."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
         
          <form
            onSubmit={handleSubmit}
            role="search"
            className="relative w-full sm:w-[280px]"
          >
            <label htmlFor="email-search" className="sr-only">
              Search emails
            </label>

            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
            />

            <input
              id="email-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search emails..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#00b341] focus:ring-3 focus:ring-[#00b341]/10"
            />
          </form>

          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-3 focus:ring-gray-100"
          >
            <Filter
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>Filter</span>
          </button>

        
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh emails"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-3 focus:ring-[#00b341]/10"
          >
            <RefreshCw
              className="h-4 w-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>Refresh</span>
          </button>
        </div>
      </div>
    </section>
  );
}