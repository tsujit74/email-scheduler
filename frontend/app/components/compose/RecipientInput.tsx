"use client";

import { KeyboardEvent, useState } from "react";

type RecipientInputProps = {
  recipients: string[];
  onChange: (recipients: string[]) => void;
  disabled?: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecipientInput({
  recipients,
  onChange,
  disabled = false,
}: RecipientInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const addRecipients = (value: string) => {
    const values = value
      .split(/[\s,;\n]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!values.length) return;

    const invalidEmail = values.find((email) => !EMAIL_REGEX.test(email));

    if (invalidEmail) {
      setError(`Invalid email address: ${invalidEmail}`);
      return;
    }

    const uniqueRecipients = [...new Set(values)];
    const newRecipients = uniqueRecipients.filter(
      (email) => !recipients.includes(email),
    );

    if (!newRecipients.length) {
      setError("These recipient addresses have already been added.");
      setInput("");
      return;
    }

    setError("");
    setInput("");
    onChange([...recipients, ...newRecipients]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === ";") {
      event.preventDefault();
      addRecipients(input);
    }

    if (event.key === "Backspace" && !input && recipients.length) {
      onChange(recipients.slice(0, -1));
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);

    if (error) {
      setError("");
    }

    if (/[,\n;]/.test(value)) {
      addRecipients(value);
    }
  };

  const removeRecipient = (recipient: string) => {
    onChange(recipients.filter((email) => email !== recipient));
  };

  const handleBlur = () => {
    if (input.trim()) {
      addRecipients(input);
    }
  };

  return (
    <div className="w-full">
      <div
        className={[
          "min-h-[52px] rounded-lg border bg-white px-2.5 py-2 transition-all",
          "focus-within:border-[#00b341] focus-within:ring-2 focus-within:ring-[#00b341]/10",
          error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
            : "border-gray-200",
          disabled ? "cursor-not-allowed bg-gray-50 opacity-70" : "",
        ].join(" ")}
      >
        <div className="flex min-h-8 flex-wrap items-center gap-1.5">
          {recipients.map((recipient) => (
            <span
              key={recipient}
              className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
            >
              <span className="max-w-[180px] truncate sm:max-w-[260px]">
                {recipient}
              </span>

              <button
                type="button"
                disabled={disabled}
                onClick={() => removeRecipient(recipient)}
                aria-label={`Remove ${recipient}`}
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-sm leading-none text-gray-400 transition hover:bg-red-100 hover:text-red-500 disabled:pointer-events-none"
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          ))}

          <input
            id="recipient-input"
            type="text"
            value={input}
            disabled={disabled}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={
              recipients.length
                ? "Add another recipient..."
                : "Enter email addresses..."
            }
            autoComplete="off"
            className="min-w-[160px] flex-1 bg-transparent px-1.5 py-1.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-gray-400">
          Press Enter or use commas to add multiple addresses
        </p>

        <span
          className={[
            "shrink-0 text-xs font-medium",
            recipients.length ? "text-gray-600" : "text-gray-400",
          ].join(" ")}
        >
          {recipients.length}{" "}
          {recipients.length === 1 ? "recipient" : "recipients"}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
