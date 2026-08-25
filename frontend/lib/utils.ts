export function getInitials(
  name?: string | null,
  fallback = "U",
) {
  return (
    name
      ?.split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || fallback
  );
}