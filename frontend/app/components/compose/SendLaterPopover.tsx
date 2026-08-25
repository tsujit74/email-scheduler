"use client";

import { CalendarDays, Check, Clock3 } from "lucide-react";

type SendLaterPopoverProps = {
  startDate: string;
  startTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onCancel: () => void;
  onDone: () => void;
};

const formatLocalDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const formatLocalTime = (date: Date) =>
  [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
  ].join(":");

export default function SendLaterPopover({
  startDate,
  startTime,
  onDateChange,
  onTimeChange,
  onCancel,
  onDone,
}: SendLaterPopoverProps) {
  const setSchedule = (date: Date, time?: string) => {
    onDateChange(formatLocalDate(date));
    onTimeChange(time ?? formatLocalTime(date));
  };

  const setTomorrowTime = (time: string) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    setSchedule(date, time);
  };

  const setQuickTime = (hoursFromNow: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hoursFromNow);
    setSchedule(date);
  };

  return (
    <div
      role="dialog"
      aria-label="Schedule email"
      className="absolute right-0 top-full z-50 mt-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10"
    >
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00b341]/10 text-[#00b341]">
            <Clock3 size={20} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">
              Schedule email
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Choose when you want your emails to start sending.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <CalendarDays
            size={15}
            className="text-gray-400"
            strokeWidth={1.8}
          />

          <p className="text-xs font-semibold text-gray-600">
            Date & time
          </p>
        </div>

        <div className="grid grid-cols-[1fr_115px] gap-2">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(event) => onDateChange(event.target.value)}
              aria-label="Schedule date"
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-[#00b341] focus:bg-white focus:ring-4 focus:ring-[#00b341]/10"
            />
          </div>

          <input
            type="time"
            value={startTime}
            onChange={(event) => onTimeChange(event.target.value)}
            aria-label="Schedule time"
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-[#00b341] focus:bg-white focus:ring-4 focus:ring-[#00b341]/10"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-4">
        <p className="mb-3 text-xs font-semibold text-gray-600">
          Quick select
        </p>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setQuickTime(24)}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Tomorrow
            </span>

            <span className="text-xs text-gray-400 group-hover:text-gray-500">
              Same time
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTomorrowTime("10:00")}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Tomorrow morning
            </span>

            <span className="text-xs text-gray-400 group-hover:text-gray-500">
              10:00 AM
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTomorrowTime("11:00")}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Tomorrow late morning
            </span>

            <span className="text-xs text-gray-400 group-hover:text-gray-500">
              11:00 AM
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTomorrowTime("15:00")}
            className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Tomorrow afternoon
            </span>

            <span className="text-xs text-gray-400 group-hover:text-gray-500">
              3:00 PM
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-3.5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onDone}
          disabled={!startDate || !startTime}
          className="inline-flex items-center gap-2 rounded-xl bg-[#00b341] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#009c39] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#00b341]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={16} strokeWidth={2.2} />
          Done
        </button>
      </div>
    </div>
  );
}