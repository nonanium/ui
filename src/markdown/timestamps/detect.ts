import { unixFromFields, zonedFields, type TimestampStyle } from "./format";

const months = [
  ["january", "jan", "januar"],
  ["february", "feb", "februar"],
  ["march", "mar", "märz", "maerz"],
  ["april", "apr"],
  ["may", "mai"],
  ["june", "jun", "juni"],
  ["july", "jul", "juli"],
  ["august", "aug"],
  ["september", "sep", "sept"],
  ["october", "oct", "oktober", "okt"],
  ["november", "nov"],
  ["december", "dec", "dezember", "dez"],
];
const monthPattern = months.flat().join("|");
const datePattern = `(?:\\d{4}-\\d{2}-\\d{2}|\\d{1,2}\\.\\d{1,2}\\.\\d{4}|\\d{1,2}\\.? +(?:${monthPattern})\\.? +\\d{4}|(?:${monthPattern})\\.? +\\d{1,2},? +\\d{4})`;
const timePattern =
  "(?:\\d{1,2}:\\d{2}(?::\\d{2})?(?: *[ap]m)?|\\d{1,2} *[ap]m)";
const offsetPattern = "(?:Z|[+-]\\d{2}:?\\d{2})";
const detectionPattern = new RegExp(
  `(?<![\\p{L}\\p{N}_:/.-])(?:${datePattern}(?:[T ]+${timePattern}(?: *${offsetPattern})?)?|${timePattern})(?![\\p{L}\\p{N}_:/]|\\.\\d)`,
  "giu",
);

export type DetectedTimestamp = {
  from: number;
  to: number;
  unix: number;
  style: TimestampStyle;
  kind: "date" | "time" | "datetime";
};

export function detectTimestamps(
  text: string,
  timeZone?: string,
  defaults?: Partial<Record<DetectedTimestamp["kind"], TimestampStyle>>,
  now = Date.now(),
) {
  const results: DetectedTimestamp[] = [];
  for (const match of text.matchAll(detectionPattern)) {
    let value = match[0];
    const dateMatch = value.match(new RegExp(`^${datePattern}`, "iu"));
    let date = zonedFields(Math.floor(now / 1000), timeZone).date;
    if (dateMatch) {
      const raw = dateMatch[0];
      if (/^\d{4}-/.test(raw)) date = raw;
      else if (/^\d+\.\d+\./.test(raw)) {
        const [day, month, year] = raw.split(".");
        date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      } else {
        const fields = raw.toLowerCase().replace(/[.,]/g, "").split(/ +/);
        const firstIsDay = /^\d+$/.test(fields[0]);
        const month =
          months.findIndex((names) =>
            names.includes(fields[firstIsDay ? 1 : 0]),
          ) + 1;
        date = `${fields[2]}-${String(month).padStart(2, "0")}-${fields[firstIsDay ? 0 : 1].padStart(2, "0")}`;
      }
      value = value.slice(raw.length).replace(/^[T ]+/, "");
    }
    const hasTime = value.length > 0;
    let time = "00:00:00";
    let offset: string | undefined;
    if (hasTime) {
      const parsed = value.match(
        /^(\d{1,2})(?::(\d{2})(?::(\d{2}))?)?\s*([ap]m)?\s*(Z|[+-]\d{2}:?\d{2})?$/i,
      );
      if (!parsed) continue;
      let hour = Number(parsed[1]);
      if (parsed[4]) {
        if (hour < 1 || hour > 12) continue;
        hour = (hour % 12) + (parsed[4].toLowerCase() === "pm" ? 12 : 0);
      }
      time = `${String(hour).padStart(2, "0")}:${parsed[2] ?? "00"}:${parsed[3] ?? "00"}`;
      offset = parsed[5];
    }
    let unix = unixFromFields(date, time, offset ? "UTC" : timeZone);
    if (unix === null) continue;
    if (offset && offset.toUpperCase() !== "Z") {
      const digits = offset.replace(":", "");
      const hours = Number(digits.slice(1, 3));
      const minutes = Number(digits.slice(3, 5));
      if (hours > 23 || minutes > 59) continue;
      unix -= (hours * 3600 + minutes * 60) * (offset[0] === "+" ? 1 : -1);
    }
    const kind = dateMatch ? (hasTime ? "datetime" : "date") : "time";
    results.push({
      from: match.index,
      to: match.index + match[0].length,
      unix,
      kind,
      style:
        defaults?.[kind] ??
        (kind === "time" ? "t" : kind === "date" ? "d" : "f"),
    });
  }
  return results;
}
