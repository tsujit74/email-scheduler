"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ComposeHeader from "../components/compose/ComposeHeader";
import RecipientInput from "../components/compose/RecipientInput";
import SendLaterPopover from "../components/compose/SendLaterPopover";
import { addRecipients, createCampaign, getCurrentUser } from "@/lib/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ComposePage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recipients, setRecipients] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [delayBetweenEmails, setDelayBetweenEmails] = useState("0");
  const [hourlyLimit, setHourlyLimit] = useState("100");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [showSendLater, setShowSendLater] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        setUserEmail(response.user.email);
      } catch {
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const isCsv =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

    const isText =
      file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");

    if (!isCsv && !isText) {
      setError("Please upload a CSV or TXT file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const content = String(reader.result ?? "");

      const emails = content
        .split(/[\s,;,\n\r]+/)
        .map((value) => value.trim().toLowerCase())
        .filter((value) => EMAIL_REGEX.test(value));

      const uniqueEmails = [...new Set(emails)];

      if (!uniqueEmails.length) {
        setError("No valid email addresses were found in the file.");
        setFileName("");
        return;
      }

      setRecipients((current) => [
        ...current,
        ...uniqueEmails.filter((email) => !current.includes(email)),
      ]);

      setFileName(file.name);
    };

    reader.onerror = () => {
      setError("Unable to read the selected file.");
    };

    reader.readAsText(file);

    event.target.value = "";
  };

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    setError("");

    if (!recipients.length) {
      setError("Please add at least one recipient.");
      return;
    }

    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!body.trim()) {
      setError("Email body is required.");
      return;
    }

    if (!startDate || !startTime) {
      setError("Please select a date and time before scheduling.");
      setShowSendLater(true);
      return;
    }

    const delay = Number(delayBetweenEmails);
    const limit = Number(hourlyLimit);

    const startDateTime = new Date(`${startDate}T${startTime}`);

    if (!Number.isFinite(delay) || delay < 0) {
      setError("Delay between emails must be 0 seconds or greater.");
      return;
    }

    if (!Number.isInteger(delay)) {
      setError("Delay between emails must be a whole number.");
      return;
    }

    if (!Number.isFinite(limit) || limit <= 0) {
      setError("Hourly limit must be greater than 0.");
      return;
    }

    if (!Number.isInteger(limit)) {
      setError("Hourly limit must be a whole number.");
      return;
    }

    if (Number.isNaN(startDateTime.getTime())) {
      setError("Please enter a valid scheduling date and time.");
      setShowSendLater(true);
      return;
    }

    if (startDateTime.getTime() <= Date.now()) {
      setError("Scheduled time must be in the future.");
      setShowSendLater(true);
      return;
    }

    try {
      setSubmitting(true);

      const campaignResponse = await createCampaign({
        subject: subject.trim(),
        body: body.trim(),
        startTime: startDateTime.toISOString(),
        delayBetweenEmails: delay,
        hourlyLimit: limit,
      });

      await addRecipients(campaignResponse.campaign.id, recipients);

      router.push("/dashboard");
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("not authenticated")
      ) {
        router.replace("/login");
        return;
      }

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while scheduling the email.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handleScheduleClick = () => {
    setError("");
    setShowSendLater((visible) => !visible);
  };

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <ComposeHeader
          onBack={handleCancel}
          onSchedule={handleScheduleClick}
          onAttachment={() => fileInputRef.current?.click()}
          onSend={() => handleSubmit()}
          submitting={submitting}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,text/csv,text/plain"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="pointer-events-none absolute right-5 top-[60px] z-50 sm:right-8 lg:right-10">
          <div className="pointer-events-auto">
            {showSendLater && (
              <SendLaterPopover
                startDate={startDate}
                startTime={startTime}
                onDateChange={setStartDate}
                onTimeChange={setStartTime}
                onCancel={() => setShowSendLater(false)}
                onDone={() => {
                  setShowSendLater(false);
                  setError("");
                }}
              />
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 lg:px-10"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            <div className="grid gap-2 px-5 py-4 sm:grid-cols-[90px_1fr] sm:items-center">
              <span className="text-sm font-medium text-gray-500">From</span>

              <div className="w-fit max-w-full truncate rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {userEmail}
              </div>
            </div>

            <div className="grid gap-2 px-3 py-2 sm:grid-cols-[90px_1fr] sm:items-start">
              <span className="pt-2 text-sm font-medium text-gray-500">To</span>

              <RecipientInput
                recipients={recipients}
                onChange={setRecipients}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2 px-5 py-4 sm:grid-cols-[90px_1fr] sm:items-center">
              <label
                htmlFor="subject"
                className="text-sm font-medium text-gray-500"
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                value={subject}
                disabled={submitting}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Add a subject"
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex min-h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600">
                <span>Delay between emails</span>

                <span className="ml-4 flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={delayBetweenEmails}
                    disabled={submitting}
                    onChange={(event) =>
                      setDelayBetweenEmails(event.target.value)
                    }
                    className="h-8 w-16 rounded-md border border-gray-200 px-2 text-center text-sm text-gray-800 outline-none transition focus:border-[#00b341] focus:ring-2 focus:ring-[#00b341]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <span className="text-xs text-gray-400">sec</span>
                </span>
              </label>

              <label className="flex min-h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-600">
                <span>Hourly limit</span>

                <span className="ml-4 flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={hourlyLimit}
                    disabled={submitting}
                    onChange={(event) => setHourlyLimit(event.target.value)}
                    className="h-8 w-16 rounded-md border border-gray-200 px-2 text-center text-sm text-gray-800 outline-none transition focus:border-[#00b341] focus:ring-2 focus:ring-[#00b341]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <span className="text-xs text-gray-400">per hour</span>
                </span>
              </label>
            </div>

            {fileName && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
                <span className="truncate">{fileName}</span>

                <span className="ml-3 shrink-0 font-medium text-[#00b341]">
                  {recipients.length} recipients
                </span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5">
            <label htmlFor="body" className="sr-only">
              Email body
            </label>

            <textarea
              id="body"
              value={body}
              disabled={submitting}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your email..."
              className="min-h-[360px] w-full resize-y rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm leading-7 text-gray-800 outline-none transition focus:border-[#00b341] focus:bg-white focus:ring-4 focus:ring-[#00b341]/10 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="fixed left-1/2 top-10 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-lg"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600"
            >
              !
            </span>

            <p className="flex-1">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0 text-lg leading-none text-red-400 transition hover:text-red-600"
            >
              ×
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
