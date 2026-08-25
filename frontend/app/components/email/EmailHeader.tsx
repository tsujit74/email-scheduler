"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import EmailActions from "./EmailActions";

type EmailHeaderProps = {
  subject: string;
};

export default function EmailHeader({ subject }: EmailHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            title="Go back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-100"
          >
            <ArrowLeft size={19} strokeWidth={1.9} />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
              Email
            </p>

            <h1
              title={subject}
              className="mt-0.5 truncate text-base font-semibold text-gray-900 sm:text-lg"
            >
              {subject || "No subject"}
            </h1>
          </div>
        </div>

        <EmailActions />
      </div>
    </header>
  );
}