import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

function calendarDate(value: string) {
  return new Date(`${value}T12:00:00Z`);
}

function dateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function Calendar({
  value,
  onValueChange,
  locale,
}: {
  value: string;
  onValueChange: (value: string) => void;
  locale?: string;
}) {
  const [month, setMonth] = useState(() => value.slice(0, 7));
  const [focused, setFocused] = useState(value);
  const first = calendarDate(`${month}-01`);
  const start = new Date(first);
  start.setUTCDate(1 - ((first.getUTCDay() + 6) % 7));
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  });
  const labelFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeZone: "UTC",
  });
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  });
  const moveMonth = (direction: number) => {
    const next = new Date(first);
    next.setUTCMonth(next.getUTCMonth() + direction);
    if (next.getUTCFullYear() >= 1 && next.getUTCFullYear() <= 9999)
      setMonth(dateString(next).slice(0, 7));
  };
  return (
    <div data-slot="calendar" className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous month"
          disabled={month === "0001-01"}
          onClick={() => moveMonth(-1)}
        >
          <ChevronLeft />
        </Button>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Month</span>
          <Select<number>
            value={first.getUTCMonth()}
            onValueChange={(value) => {
              if (value !== null)
                setMonth(
                  `${month.slice(0, 4)}-${String(value + 1).padStart(2, "0")}`,
                );
            }}
          >
            <SelectTrigger className="w-full" aria-label="Month">
              <SelectValue>{monthFormatter.format(first)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, index) => (
                <SelectItem key={index} value={index}>
                  {monthFormatter.format(new Date(Date.UTC(2024, index, 1)))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="w-20">
          <span className="sr-only">Year</span>
          <Input
            type="number"
            min={1}
            max={9999}
            value={Number(month.slice(0, 4))}
            onChange={(event) => {
              const year = event.target.valueAsNumber;
              if (Number.isInteger(year) && year >= 1 && year <= 9999)
                setMonth(`${String(year).padStart(4, "0")}-${month.slice(5)}`);
            }}
          />
        </label>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next month"
          disabled={month === "9999-12"}
          onClick={() => moveMonth(1)}
        >
          <ChevronRight />
        </Button>
      </div>
      <table
        className="w-full table-fixed border-collapse"
        aria-label={`${monthFormatter.format(first)} ${first.getUTCFullYear()}`}
        onKeyDown={(event) => {
          const target =
            event.target instanceof HTMLElement
              ? event.target.closest<HTMLButtonElement>("[data-date]")
              : null;
          if (!target?.dataset.date) return;
          const delta = {
            ArrowLeft: -1,
            ArrowRight: 1,
            ArrowUp: -7,
            ArrowDown: 7,
          }[event.key];
          if (delta === undefined) return;
          event.preventDefault();
          const next = calendarDate(target.dataset.date);
          next.setUTCDate(next.getUTCDate() + delta);
          if (next.getUTCFullYear() < 1 || next.getUTCFullYear() > 9999) return;
          const nextValue = dateString(next);
          setMonth(nextValue.slice(0, 7));
          setFocused(nextValue);
          requestAnimationFrame(() =>
            target
              .closest("table")
              ?.querySelector<HTMLButtonElement>(`[data-date="${nextValue}"]`)
              ?.focus(),
          );
        }}
      >
        <thead>
          <tr>
            {Array.from({ length: 7 }, (_, index) => {
              const day = new Date(start);
              day.setUTCDate(day.getUTCDate() + index);
              return (
                <th
                  key={index}
                  scope="col"
                  className="pb-1 text-xs font-normal text-muted-foreground"
                >
                  {dayFormatter.format(day)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, week) => (
            <tr key={week}>
              {Array.from({ length: 7 }, (_, index) => {
                const day = new Date(start);
                day.setUTCDate(day.getUTCDate() + week * 7 + index);
                const date = dateString(day);
                const outside = date.slice(0, 7) !== month;
                return (
                  <td key={date} className="p-0.5 text-center">
                    <Button
                      variant={date === value ? "default" : "ghost"}
                      size="icon"
                      className={outside ? "text-muted-foreground" : undefined}
                      disabled={
                        day.getUTCFullYear() < 1 || day.getUTCFullYear() > 9999
                      }
                      aria-label={labelFormatter.format(day)}
                      aria-pressed={date === value}
                      data-date={date}
                      tabIndex={
                        date ===
                        (focused.slice(0, 7) === month
                          ? focused
                          : `${month}-01`)
                          ? 0
                          : -1
                      }
                      onClick={() => {
                        onValueChange(date);
                        setFocused(date);
                        if (outside) setMonth(date.slice(0, 7));
                      }}
                    >
                      {day.getUTCDate()}
                    </Button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DateTimePicker({
  value,
  onValueChange,
  locale,
  disabled,
}: {
  value: { date: string; time: string };
  onValueChange: (value: { date: string; time: string }) => void;
  locale?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const time = value.time.split(":");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={disabled}
          />
        }
      >
        <CalendarDays />
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeZone: "UTC",
        }).format(calendarDate(value.date))}
        , {value.time}
      </PopoverTrigger>
      <PopoverContent className="max-h-(--available-height) w-80 max-w-[calc(100vw-2rem)] overflow-y-auto">
        <PopoverTitle>Date and time</PopoverTitle>
        <Calendar
          value={value.date}
          onValueChange={(date) => onValueChange({ ...value, date })}
          locale={locale}
        />
        <div className="grid grid-cols-3 gap-2">
          {["Hour", "Minute", "Second"].map((label, index) => (
            <label key={label} className="flex flex-col gap-1 text-xs">
              {label}
              <Select<number>
                value={Number(time[index] ?? 0)}
                onValueChange={(number) => {
                  if (number === null) return;
                  const next = [...time];
                  next[index] = String(number).padStart(2, "0");
                  onValueChange({ ...value, time: next.join(":") });
                }}
              >
                <SelectTrigger className="w-full" aria-label={label}>
                  <SelectValue>
                    {String(time[index] ?? "00").padStart(2, "0")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: index === 0 ? 24 : 60 },
                    (_, number) => (
                      <SelectItem key={number} value={number}>
                        {String(number).padStart(2, "0")}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </label>
          ))}
        </div>
        <Button className="w-full" onClick={() => setOpen(false)}>
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
