"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Paperclip, Clock } from "lucide-react";

type ComposeHeaderProps = {
  onBack: () => void;
  onSchedule: () => void;
  onAttachment?: () => void;
  onSend: () => void;
  submitting: boolean;
};

type HeaderActionProps = {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
};

function HeaderAction({
  label,
  onClick,
  children,
  disabled = false,
}: HeaderActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default function ComposeHeader({
  onBack,
  onSchedule,
  onAttachment,
  onSend,
  submitting,
}: ComposeHeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-[60px] w-full max-w-5xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={onBack}
          className="group flex min-w-0 items-center gap-2 rounded-lg py-2 pr-3 text-left text-gray-800 transition-colors hover:text-[#00b341]"
        >
          <ArrowLeft
            size={21}
            strokeWidth={1.8}
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />

          <span className="truncate text-base font-semibold sm:text-lg">
            Compose New Email
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <HeaderAction
            label="Attach file"
            onClick={onAttachment}
            disabled={submitting}
          >
            <Paperclip
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </HeaderAction>

          <HeaderAction
            label="Schedule email"
            onClick={onSchedule}
            disabled={submitting}
          >
            <Clock
              size={20}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </HeaderAction>

          <button
            type="button"
            onClick={onSend}
            disabled={submitting}
            className="ml-1 min-w-[82px] rounded-full bg-[#00b341] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#009c39] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#00b341]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-2"
          >
            {submitting ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </header>
  );
}