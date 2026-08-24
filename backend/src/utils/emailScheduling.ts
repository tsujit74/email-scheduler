export function calculateScheduledAt(
  startTime: Date,
  index: number,
  delayBetweenEmails: number,
  hourlyLimit: number,
): Date {
  const emailsPerHour = Math.max(1, hourlyLimit);

  const hourIndex = Math.floor(index / emailsPerHour);
  const indexWithinHour = index % emailsPerHour;

  const hourStart = new Date(
    startTime.getTime() + hourIndex * 60 * 60 * 1000,
  );

  return new Date(
    hourStart.getTime() +
      indexWithinHour * delayBetweenEmails,
  );
}