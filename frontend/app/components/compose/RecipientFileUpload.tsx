"use client";

import { ChangeEvent, useRef } from "react";
import { Upload } from "lucide-react";

type RecipientFileUploadProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

export default function RecipientFileUpload({
  onFileSelect,
  disabled = false,
}: RecipientFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

    event.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-label="Upload CSV or TXT file"
        title="Upload CSV or TXT file"
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-50"
      >
        <Upload
          size={17}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </button>
    </>
  );
}