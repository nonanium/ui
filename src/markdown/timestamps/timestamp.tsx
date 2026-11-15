import { useEffect, useState } from "react";
import { Button } from "../../cmp/button";
import { DateTimePicker } from "../../cmp/date-time-picker";
import { withTooltip } from "../../cmp/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../cmp/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../cmp/popover";
import { useNonaniumSettings, type NonaniumSettings } from "../../settings";
import {
  formatTimestamp,
  timestampStyleLabels,
  timestampStyles,
  unixFromFields,
  zonedFields,
  type TimestampStyle,
} from "./format";

export function TimestampLabel({
  unix,
  style,
  settings,
}: {
  unix: number;
  style: TimestampStyle;
  settings: NonaniumSettings;
}) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (style !== "R") return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [style]);
  return (
    <time dateTime={new Date(unix * 1000).toISOString()}>
      {formatTimestamp(unix, style, settings.locale, settings.timeZone, now)}
    </time>
  );
}

export function TimestampEditor({
  unix,
  style: initialStyle,
  settings,
  onChange,
}: {
  unix: number;
  style: TimestampStyle;
  settings: NonaniumSettings;
  onChange: (unix: number, style: TimestampStyle) => void;
}) {
  const [fields, setFields] = useState(() =>
    zonedFields(unix, settings.timeZone),
  );
  const [style, setStyle] = useState(initialStyle);
  const original = zonedFields(unix, settings.timeZone);
  const selected =
    fields.date === original.date && fields.time === original.time
      ? unix
      : unixFromFields(fields.date, fields.time, settings.timeZone);
  const apply = (nextFields: typeof fields, nextStyle: TimestampStyle) => {
    const next =
      nextFields.date === original.date && nextFields.time === original.time
        ? unix
        : unixFromFields(nextFields.date, nextFields.time, settings.timeZone);
    if (next !== null) onChange(next, nextStyle);
  };
  const changeStyle = (next: TimestampStyle) => {
    setStyle(next);
    apply(fields, next);
  };
  return (
    <>
      <DateTimePicker
        value={fields}
        onValueChange={(value) => {
          setFields(value);
          apply(value, style);
        }}
        locale={settings.locale}
      />
      <label className="block min-w-0">
        <span className="sr-only">Display mode</span>
        <Select<TimestampStyle>
          value={style}
          onValueChange={(value) => {
            if (value) changeStyle(value);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Display mode">
            <SelectValue>{timestampStyleLabels[style]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {timestampStyles.map((value) => (
              <SelectItem key={value} value={value}>
                {timestampStyleLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      {selected === null && (
        <p role="alert" className="text-destructive">
          Choose a valid date and time. This time may not exist because the
          clocks change.
        </p>
      )}
    </>
  );
}

export function Timestamp({
  unix,
  style = "f",
  settings: override,
  onChange,
}: {
  unix: number;
  style?: TimestampStyle;
  settings?: NonaniumSettings;
  onChange?: (unix: number, style: TimestampStyle) => void;
}) {
  const { settings: contextual } = useNonaniumSettings();
  const settings = { ...contextual, ...override };
  const [open, setOpen] = useState(false);
  if (!onChange) {
    return withTooltip(
      <span
        tabIndex={0}
        className="rounded bg-muted px-1 text-primary underline underline-offset-4"
      >
        <TimestampLabel unix={unix} style={style} settings={settings} />
      </span>,
      "This timestamp is adjusted to your local time.",
    );
  }
  const trigger = (
    <PopoverTrigger
      render={
        <Button
          variant="secondary"
          size="xs"
          className="h-auto rounded px-1 py-0 align-baseline text-[length:inherit] font-normal"
        />
      }
    >
      <TimestampLabel unix={unix} style={style} settings={settings} />
    </PopoverTrigger>
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      {trigger}
      <PopoverContent
        aria-label="Timestamp settings"
        className="max-h-(--available-height) w-80 max-w-[calc(100vw-2rem)] overflow-y-auto"
      >
        <TimestampEditor
          key={String(open)}
          unix={unix}
          style={style}
          settings={settings}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
