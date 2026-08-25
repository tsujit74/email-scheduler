"use client";

type ComposeActionsProps = {
  submitting: boolean;
  onCancel: () => void;
};

export default function ComposeActions({
  submitting,
  onCancel,
}: ComposeActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2.5 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-100 disabled:pointer-events-none disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-w-[140px] items-center justify-center rounded-lg bg-[#00b341] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#009c39] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00b341]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && (
          <span
            aria-hidden="true"
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}

        {submitting ? "Scheduling..." : "Schedule Email"}
      </button>
    </div>
  );
}