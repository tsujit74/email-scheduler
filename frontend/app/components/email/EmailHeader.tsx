"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import EmailActions from "./EmailActions";

type Props = {
  subject: string;
};

export default function EmailHeader({ subject }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/95 backdrop-blur">
      <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full
              text-gray-500
              transition-all duration-200
              hover:bg-gray-100
              hover:text-gray-900
              active:scale-95
            "
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>

          <div className="min-w-0">
            <h1
              title={subject}
              className="
                truncate
                text-[15px]
                font-medium
                leading-6
                tracking-[-0.01em]
                text-gray-900
                sm:text-base
              "
            >
              {subject}
            </h1>
          </div>
        </div>

        <div className="shrink-0">
          <EmailActions />
        </div>
      </div>
    </header>
  );
}
