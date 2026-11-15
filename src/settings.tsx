import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TimestampStyle } from "./markdown/timestamps/format";
import type { SoundConfig } from "./sounds";

export type NonaniumStorage = Pick<Storage, "getItem" | "setItem">;

export type NonaniumSettings = {
  sounds?: SoundConfig;
  locale?: string;
  timeZone?: string;
  timestamps?: {
    detect?: boolean;
    hints?: boolean;
    defaultModes?: Partial<
      Record<"time" | "date" | "datetime", TimestampStyle>
    >;
  };
  acknowledgedHints?: readonly string[];
};

const SettingsContext = createContext<{
  settings: NonaniumSettings;
  updateSettings: (update: Partial<NonaniumSettings>) => void;
}>({ settings: {}, updateSettings: () => {} });

export function NonaniumSettingsProvider({
  children,
  settings,
  onSettingsChange,
  storage,
  storageKey = "nonanium-ui",
}: {
  children: ReactNode;
  settings?: NonaniumSettings;
  onSettingsChange?: (settings: NonaniumSettings) => void;
  storage?: NonaniumStorage;
  storageKey?: string;
}) {
  const [stored, setStored] = useState<NonaniumSettings>(() => {
    try {
      const value: unknown = JSON.parse(storage?.getItem(storageKey) ?? "{}");
      return value && typeof value === "object" && !Array.isArray(value)
        ? (value as NonaniumSettings)
        : {};
    } catch {
      return {};
    }
  });
  const resolved = useMemo(
    () => ({ ...stored, ...settings }),
    [stored, settings],
  );
  const updateSettings = useCallback(
    (update: Partial<NonaniumSettings>) => {
      const next = { ...resolved, ...update };
      setStored(next);
      onSettingsChange?.(next);
      storage?.setItem(storageKey, JSON.stringify(next));
    },
    [resolved, onSettingsChange, storage, storageKey],
  );
  const value = useMemo(
    () => ({ settings: resolved, updateSettings }),
    [resolved, updateSettings],
  );
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useNonaniumSettings() {
  return useContext(SettingsContext);
}
