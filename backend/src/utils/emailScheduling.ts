export function calculateScheduledAt(
  startTime: Date,
  index: number,
  delayBetweenEmails: number,
): Date {
  const delayInMs =
    Math.max(0, delayBetweenEmails) * 1000;

  return new Date(
    startTime.getTime() + index * delayInMs,
  );
}