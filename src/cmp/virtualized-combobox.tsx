import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "./button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "./combobox";

export function VirtualizedCombobox({
  items,
  value,
  onValueChange,
  label,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results",
  disabled = false,
  className,
}: {
  items: readonly { value: string; label: string; disabled?: boolean }[];
  value: string | null;
  onValueChange: (value: string) => void;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return items.filter((item) =>
      item.label.toLocaleLowerCase().includes(query),
    );
  }, [items, search]);
  const selected = items.find((item) => item.value === value) ?? null;
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 32,
    getItemKey: (index) => filtered[index].value,
    overscan: 4,
    enabled: open,
  });

  return (
    <Combobox
      items={items}
      filteredItems={filtered}
      value={selected}
      onValueChange={(item) => {
        if (item) onValueChange(item.value);
      }}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, selected) => item.value === selected.value}
      virtualized
      disabled={disabled}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
      inputValue={search}
      onInputValueChange={(next) => {
        setSearch(next);
        virtualizer.scrollToOffset(0);
      }}
      onItemHighlighted={(_, details) => {
        if (details.reason === "keyboard" && details.index >= 0)
          virtualizer.scrollToIndex(details.index, { align: "auto" });
      }}
    >
      <ComboboxTrigger
        render={<Button variant="outline" className={className} />}
        aria-label={label}
      >
        <span className="min-w-0 flex-1 truncate">
          {selected?.label ?? placeholder}
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          aria-label={`Search ${label.toLocaleLowerCase()}`}
          placeholder={searchPlaceholder}
          showTrigger={false}
        />
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList
          ref={listRef}
          style={{ height: Math.min(256, filtered.length * 32 + 8) }}
        >
          <div
            className="relative"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((row) => {
              const item = filtered[row.index];
              return (
                <ComboboxItem
                  key={item.value}
                  index={row.index}
                  value={item}
                  disabled={item.disabled}
                  className="absolute left-0 top-0 h-8"
                  style={{ transform: `translateY(${row.start}px)` }}
                >
                  <span className="truncate">{item.label}</span>
                </ComboboxItem>
              );
            })}
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
