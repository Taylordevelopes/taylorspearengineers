// utils/dateConverter.ts

export const formatUTCDate = (
  dateString: string,
  timeZone: string = "America/New_York", // Default to UTC, or use 'America/New_York'
  locale: string = "en-US",
): string => {
  const date = new Date(dateString);

  // Validate date
  if (isNaN(date.getTime())) return "Invalid Date";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: timeZone, // Target time zone
  }).format(date);
};
