export const timestampStyles = ["t", "T", "d", "D", "f", "F", "R"] as const;
export type TimestampStyle = (typeof timestampStyles)[number];
export const timestampStyleLabels: Record<TimestampStyle, string> = {
  t: "Short time",
  T: "Long time",
  d: "Short date",
  D: "Long date",
  f: "Date and time",
  F: "Full date and time",
  R: "Relative time",
};

export const timestampPattern = /<t:(-?\d+)(?::([tTdDfFR]))?>/g;

export function validUnix(unix: number) {
  return Number.isSafeInteger(unix) && Math.abs(unix) <= 8_640_000_000_000;
}

export function timestampToken(unix: number, style: TimestampStyle = "f") {
  return `<t:${unix}:${style}>`;
}

export function formatTimestamp(
  unix: number,
  style: TimestampStyle,
  locale?: string,
  timeZone?: string,
  now = Date.now(),
) {
  if (style === "R") {
    const seconds = (unix * 1000 - now) / 1000;
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
      ["year", 31_557_600],
      ["month", 2_629_800],
      ["day", 86_400],
      ["hour", 3600],
      ["minute", 60],
      ["second", 1],
    ];
    const [unit, size] =
      units.find(([, size]) => Math.abs(seconds) >= size) ??
      units[units.length - 1];
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      Math.round(seconds / size),
      unit,
    );
  }
  const options: Record<
    Exclude<TimestampStyle, "R">,
    Intl.DateTimeFormatOptions
  > = {
    t: { hour: "numeric", minute: "2-digit" },
    T: { hour: "numeric", minute: "2-digit", second: "2-digit" },
    d: { year: "numeric", month: "2-digit", day: "2-digit" },
    D: { year: "numeric", month: "long", day: "numeric" },
    f: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
    F: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  };
  return new Intl.DateTimeFormat(locale, {
    ...options[style],
    timeZone,
  }).format(unix * 1000);
}

export function zonedFields(unix: number, timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(unix * 1000);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}:${values.second}`,
  };
}

// Find matching offsets on either side of a clock change, rejecting nonexistent local times.
export function unixFromFields(date: string, time: string, timeZone?: string) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^\d{2}:\d{2}(?::\d{2})?$/.test(time)
  )
    return null;
  const wall = new Date(`${date}T${time.length === 5 ? `${time}:00` : time}Z`);
  const naive = wall.getTime() / 1000;
  if (!validUnix(naive)) return null;
  const expected = { date, time: time.length === 5 ? `${time}:00` : time };
  const normalized = zonedFields(naive, "UTC");
  if (normalized.date !== expected.date || normalized.time !== expected.time)
    return null;
  const candidates = [-86_400, 0, 86_400]
    .map((delta) => {
      const sample = naive + delta;
      const fields = zonedFields(sample, timeZone);
      const asUtc = new Date(`${fields.date}T${fields.time}Z`).getTime() / 1000;
      return naive - (asUtc - sample);
    })
    .filter((unix) => {
      const fields = zonedFields(unix, timeZone);
      return fields.date === expected.date && fields.time === expected.time;
    });
  return candidates.length ? Math.min(...candidates) : null;
}
