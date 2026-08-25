"use client";

type EmailEditorProps = {
  subject: string;
  body: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  disabled?: boolean;
};

export default function EmailEditor({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  disabled = false,
}: EmailEditorProps) {
  return (
    <section
      aria-label="Email editor"
      className={[
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
        "focus-within:border-[#00b341] focus-within:ring-4 focus-within:ring-[#00b341]/10",
        disabled
          ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-70"
          : "border-gray-200",
      ].join(" ")}
    >
      <div className="border-b border-gray-100 px-5 sm:px-6">
        <label htmlFor="subject" className="sr-only">
          Subject
        </label>

        <input
          id="subject"
          type="text"
          value={subject}
          disabled={disabled}
          onChange={(event) => onSubjectChange(event.target.value)}
          placeholder="Subject"
          autoComplete="off"
          className="h-16 w-full bg-transparent text-base font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      <div className="px-5 sm:px-6">
        <label htmlFor="body" className="sr-only">
          Email body
        </label>

        <textarea
          id="body"
          value={body}
          disabled={disabled}
          onChange={(event) => onBodyChange(event.target.value)}
          placeholder="Write your email..."
          rows={14}
          className="min-h-[340px] w-full resize-y bg-transparent py-5 text-[15px] leading-7 text-gray-800 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-5 py-3 text-xs text-gray-400 sm:px-6">
        <span>Compose your message</span>
        <span>{body.length} characters</span>
      </div>
    </section>
  );
}