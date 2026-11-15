import type { ComponentProps } from "react";
import { ThemeProvider } from "./theme/Provider";
import { NonaniumSettingsProvider } from "./settings";
import { EmojiProvider } from "./markdown/emoji/context";
import {
  defaultEmojiRegistry,
  type EmojiRegistry,
} from "./markdown/emoji/registry";

export type NonaniumProviderProps = ComponentProps<
  typeof NonaniumSettingsProvider
> & {
  theme?: Omit<ComponentProps<typeof ThemeProvider>, "children">;
  registry?: EmojiRegistry;
};

export function NonaniumProvider({
  children,
  theme,
  registry = defaultEmojiRegistry,
  ...props
}: NonaniumProviderProps) {
  return (
    <ThemeProvider {...theme} storage={props.storage ?? theme?.storage}>
      <NonaniumSettingsProvider {...props}>
        <EmojiProvider registry={registry}>{children}</EmojiProvider>
      </NonaniumSettingsProvider>
    </ThemeProvider>
  );
}
