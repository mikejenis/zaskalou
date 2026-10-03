import type { PublicEvent } from "../data/schema";

const pragueFormatter = new Intl.DateTimeFormat("cs-CZ", {
  dateStyle: "full",
  timeZone: "Europe/Prague"
});

function defaultTime(event: PublicEvent): string {
  return event.startTime ?? "19:00";
}

function addHours(date: string, time: string, hours: number): { date: string; time: string } {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const local = new Date(Date.UTC(year, month - 1, day, hour + hours, minute));
  return {
    date: [
      local.getUTCFullYear(),
      String(local.getUTCMonth() + 1).padStart(2, "0"),
      String(local.getUTCDate()).padStart(2, "0")
    ].join("-"),
    time: [String(local.getUTCHours()).padStart(2, "0"), String(local.getUTCMinutes()).padStart(2, "0")].join(":")
  };
}

function toGoogleLocalDateTime(date: string, time: string): string {
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
}

export function formatEventDate(event: PublicEvent): string {
  const noonUtc = new Date(`${event.date}T12:00:00Z`);
  return `${pragueFormatter.format(noonUtc)} v ${defaultTime(event)}`;
}

export function createGoogleCalendarUrl(event: PublicEvent): string {
  const startTime = defaultTime(event);
  const end = addHours(event.date, startTime, 2);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleLocalDateTime(event.date, startTime)}/${toGoogleLocalDateTime(end.date, end.time)}`,
    ctz: "Europe/Prague",
    location: `${event.venue}, ${event.city}`,
    details: [`Zdroj: ${event.sources[0]?.url}`, "Přidáno přes Za Skálou."].join("\n")
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
