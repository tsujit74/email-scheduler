"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";
import RecipientFileUpload from "./RecipientFileUpload";

type RecipientInputProps = {
  recipients: string[];
  onChange: (recipients: string[]) => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_VISIBLE_RECIPIENTS = 3;

export default function RecipientInput({
  recipients,
  onChange,
  onFileSelect,
  disabled = false,
}: RecipientInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const addRecipients = (value: string) => {
    const values = value
      .split(/[\s,;\n]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!values.length) return;

    const invalidEmail = values.find(
      (email) => !EMAIL_REGEX.test(email),
    );

    if (invalidEmail) {
      setError(`Invalid email address: ${invalidEmail}`);
      return;
    }

    const uniqueEmails = [...new Set(values)];

    const newRecipients = uniqueEmails.filter(
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

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" ||
      event.key === "," ||
      event.key === ";"
    ) {
      event.preventDefault();
      addRecipients(input);
      return;
    }

    if (
      event.key === "Backspace" &&
      !input &&
      recipients.length
    ) {
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

  const handleBlur = () => {
    if (input.trim()) {
      addRecipients(input);
    }
  };

  const removeRecipient = (recipient: string) => {
    onChange(
      recipients.filter((email) => email !== recipient),
    );
  };

  const visibleRecipients = recipients.slice(
    0,
    MAX_VISIBLE_RECIPIENTS,
  );

  const remainingCount = Math.max(
    recipients.length - MAX_VISIBLE_RECIPIENTS,
    0,
  );

  return (
    <div className="w-full">
      
      <div className="flex w-full items-start gap-3">
      
        <div
          className={[
            "min-h-[52px] flex-1 border-b bg-white px-1 py-2",
            "transition-colors",
            error
              ? "border-red-400"
              : "border-gray-200 focus-within:border-gray-400",
            disabled
              ? "cursor-not-allowed bg-gray-50 opacity-70"
              : "",
          ].join(" ")}
        >
          <div className="flex min-h-8 flex-wrap items-center gap-1.5">
          
            {visibleRecipients.map((recipient) => (
              <span
                key={recipient}
                className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
              >
                <span className="max-w-[180px] truncate sm:max-w-[240px]">
                  {recipient}
                </span>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeRecipient(recipient)}
                  aria-label={`Remove ${recipient}`}
                  title={`Remove ${recipient}`}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-400 transition hover:bg-red-100 hover:text-red-500 disabled:pointer-events-none"
                >
                  <X
                    size={12}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </span>
            ))}

            {remainingCount > 0 && (
              <div className="relative">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setShowAll((current) => !current)
                  }
                  aria-expanded={showAll}
                  aria-label={`Show ${remainingCount} more recipients`}
                  className="flex h-7 min-w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-2 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-200 disabled:pointer-events-none"
                >
                  +{remainingCount}
                </button>

              
                {showAll && (
                  <div className="absolute left-0 top-9 z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl">

                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Recipients
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {recipients.length} total
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAll(false)}
                        aria-label="Close recipients"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <X size={16} strokeWidth={1.8} />
                      </button>
                    </div>

                    <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient}
                          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50"
                        >
                          <span className="min-w-0 truncate">
                            {recipient}
                          </span>

                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              removeRecipient(recipient)
                            }
                            aria-label={`Remove ${recipient}`}
                            title={`Remove ${recipient}`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none"
                          >
                            <X
                              size={13}
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              id="recipient-input"
              type="text"
              value={input}
              disabled={disabled}
              onChange={(event) =>
                handleInputChange(event.target.value)
              }
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={
                recipients.length
                  ? "Add another recipient..."
                  : "Enter email addresses..."
              }
              autoComplete="off"
              className="min-w-[160px] flex-1 border-0 bg-transparent px-1.5 py-1.5 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {onFileSelect && (
          <RecipientFileUpload
            onFileSelect={onFileSelect}
            disabled={disabled}
          />
        )}
      </div>

      
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-[11px] text-gray-400">
          Press Enter or use commas to add multiple addresses
        </p>

        <span
          className={[
            "shrink-0 text-xs font-medium",
            recipients.length
              ? "text-gray-600"
              : "text-gray-400",
          ].join(" ")}
        >
          {recipients.length}{" "}
          {recipients.length === 1
            ? "recipient"
            : "recipients"}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-1.5 text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}