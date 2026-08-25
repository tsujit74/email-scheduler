export function calculateScheduledAt(
  startTime: Date,
  index: number,
  delayBetweenEmails: number,
  hourlyLimit: number,
): Date {
  const HOUR_IN_MS = 60 * 60 * 1000;

  const delayInMs = Math.max(0, delayBetweenEmails) * 1000;

  const hourlyLimitInterval =
    HOUR_IN_MS / Math.max(1, hourlyLimit);

  const effectiveInterval = Math.max(
    delayInMs,
    hourlyLimitInterval,
  );

  return new Date(
    startTime.getTime() + index * effectiveInterval,
  );
}