import type { Theme } from "./types";
import { BUILT_IN_THEME_IDS } from "./ids";
import { RULE_PRESETS } from "./rule-presets";

export const DEFAULT_THEME_DESIGN: Theme["design"] = {
  fontScale: 1,
  fontFamily: "public-sans",
  monoFontFamily: "jetbrains-mono",
};

const TENSAMIN_LOGO = new URL("./assets/tensamin-logo.svg", import.meta.url)
  .href;
const NONANIUM_LOGO = new URL("./assets/nonanium-logo.svg", import.meta.url)
  .href;
const SECRET_LOGO = new URL("./assets/secret-logo.svg", import.meta.url).href;
const BACKLOT_LOGO = new URL("./assets/backlot-logo.svg", import.meta.url).href;
const OG_TENSAMIN_LOGO = new URL(
  "./assets/tensamin-og-logo.png",
  import.meta.url,
).href;

/**
 * Builds a theme's rules from rule preset ids, in order. Each reference
 * becomes an independent copy scoped to the theme.
 */
function presetRules(themeId: string, presetIds: string[]): Theme["rules"] {
  return presetIds.map((presetId) => {
    const preset = RULE_PRESETS.find((entry) => entry.id === presetId);
    if (!preset) throw new Error(`Unknown rule preset: ${presetId}`);
    return { ...preset, id: `${themeId}-${presetId}` };
  });
}

const TENSAMIN: Theme = {
  id: "tensamin",
  title: "Tensamin",
  logo: TENSAMIN_LOGO,
  design: DEFAULT_THEME_DESIGN,
  customCss: "",
  tokens: {
    light: {
      "--background": "oklch(0.98 0 0)",
      "--card": "#fff",
      "--primary": "#12a89e",
      "--primary-foreground": "oklch(0.985 0.012 184)",
      "--primary-foreground-alt": "oklch(0.58 0.13 185)",
      "--destructive": "#d20f39",
      "--ring": "#12a89e",
      "--sidebar": "color-mix(in oklch, var(--background) 97%, black)",
      "--sidebar-primary": "var(--primary)",
      "--markdown-code-background": "var(--card)",
    },
    dark: {
      "--background": "#131313",
      "--foreground": "#f2f2f2",
      "--card": "color-mix(in srgb, var(--background) 94%, white)",
      "--card-foreground": "#ededed",
      "--popover": "color-mix(in srgb, var(--background) 94%, white)",
      "--popover-foreground": "#f2f2f2",
      "--secondary": "color-mix(in srgb, #121212 90%, white)",
      "--secondary-foreground": "#dedede",
      "--muted": "color-mix(in srgb, #121212 96%, white)",
      "--muted-foreground": "#a9a9a9",
      "--accent": "color-mix(in srgb, #121212 90%, white)",
      "--accent-foreground": "#ededed",
      "--destructive": "#FF6467",
      "--border": "color-mix(in srgb, var(--background) 82%, white)",
      "--input": "color-mix(in srgb, #121212 75%, white)",
      "--primary": "#12a89e",
      "--primary-foreground": "oklch(0.1 0.02 190)",
      "--primary-foreground-alt": "oklch(0.78 0.13 183)",
      "--chart-1": "#7287fd",
      "--chart-2": "#209fb5",
      "--chart-3": "#40a02b",
      "--chart-4": "#df8e1d",
      "--chart-5": "#ea76cb",
      "--sidebar": "#181818",
      "--sidebar-foreground": "#dedede",
      "--sidebar-primary": "var(--primary)",
      "--sidebar-primary-foreground": "var(--primary-foreground)",
      "--sidebar-accent": "#262626",
      "--sidebar-accent-foreground": "#ededed",
      "--sidebar-border": "color-mix(in srgb, var(--sidebar) 84%, white)",
      "--sidebar-ring": "var(--ring)",
      "--markdown-code-background": "var(--card)",
    },
  },
  rules: presetRules("tensamin", ["ghost-hover-muted", "corners-medium"]),
};

const OG_TENSAMIN: Theme = {
  id: "og-tensamin",
  title: "OG Tensamin",
  logo: OG_TENSAMIN_LOGO,
  design: DEFAULT_THEME_DESIGN,
  customCss: "",
  tokens: {
    light: {
      "--background": "#f1f2fb",
      "--foreground": "#17181e",
      "--card": "var(--background)",
      "--card-foreground": "#17181e",
      "--popover": "#f8f8fd",
      "--popover-foreground": "#17181e",
      "--primary": "#aca1cf",
      "--primary-foreground": "#0f1014",
      "--primary-foreground-alt": "#71649d",
      "--secondary": "#e1e2f0",
      "--secondary-foreground": "#17181e",
      "--muted": "#e7e8f3",
      "--muted-foreground": "#626575",
      "--accent": "#d8daed",
      "--accent-foreground": "#0f1014",
      "--destructive": "#bd555d",
      "--border": "#cfd1e0",
      "--input": "#c1c4d5",
      "--ring": "#8274b2",
      "--sidebar": "#e7e8f5",
      "--sidebar-foreground": "#17181e",
      "--sidebar-primary": "#aca1cf",
      "--sidebar-primary-foreground": "#0f1014",
      "--sidebar-accent": "#d8daed",
      "--sidebar-accent-foreground": "#0f1014",
      "--sidebar-border": "#cfd1e0",
      "--sidebar-ring": "#8274b2",
      "--chart-1": "#90b99f",
      "--chart-2": "#babbf1",
      "--chart-3": "#aca1cf",
      "--chart-4": "#e29eca",
      "--chart-5": "#e5c890",
      "--markdown-code-background": "var(--card)",
    },
    dark: {
      "--background": "#0f1014",
      "--foreground": "#bebbc3",
      "--card": "#17181e",
      "--card-foreground": "#bebbc3",
      "--popover": "#17181e",
      "--popover-foreground": "#bebbc3",
      "--primary": "#aca1cf",
      "--primary-foreground": "#0f1014",
      "--primary-foreground-alt": "#babbf1",
      "--secondary": "#282a33",
      "--secondary-foreground": "#d8d6db",
      "--muted": "#17181e",
      "--muted-foreground": "#a4a0ab",
      "--accent": "#282a33",
      "--accent-foreground": "#f2f1f3",
      "--destructive": "#bd555d",
      "--border": "#282a33",
      "--input": "#383b46",
      "--ring": "#aca1cf",
      "--sidebar": "#0f1014",
      "--sidebar-foreground": "#bebbc3",
      "--sidebar-primary": "#aca1cf",
      "--sidebar-primary-foreground": "#0f1014",
      "--sidebar-accent": "#282a33",
      "--sidebar-accent-foreground": "#f2f1f3",
      "--sidebar-border": "#282a33",
      "--sidebar-ring": "#aca1cf",
      "--chart-1": "#90b99f",
      "--chart-2": "#babbf1",
      "--chart-3": "#aca1cf",
      "--chart-4": "#e29eca",
      "--chart-5": "#e5c890",
      "--markdown-code-background": "var(--card)",
    },
  },
  rules: presetRules("og-tensamin", ["popup-colors", "menu-item-highlight"]),
};

const NONANIUM: Theme = {
  id: "nonanium",
  title: "Nonanium",
  logo: NONANIUM_LOGO,
  design: DEFAULT_THEME_DESIGN,
  customCss: "",
  tokens: {
    light: {
      "--background": "#fafafa",
      "--foreground": "#171717",
      "--card": "var(--popover)",
      "--card-foreground": "#171717",
      "--popover": "#ffffff",
      "--popover-foreground": "#171717",
      "--primary": "#8c47ad",
      "--primary-foreground": "#ffffff",
      "--primary-foreground-alt": "#7b3d98",
      "--secondary": "#eeeeee",
      "--secondary-foreground": "#171717",
      "--muted": "#f2f2f2",
      "--muted-foreground": "#666666",
      "--accent": "#e8e8e8",
      "--accent-foreground": "#171717",
      "--destructive": "#b91c1c",
      "--border": "#dddddd",
      "--input": "#dddddd",
      "--ring": "#9d53bc",
      "--chart-1": "#8c47ad",
      "--chart-2": "#2563eb",
      "--chart-3": "#15803d",
      "--chart-4": "#ca8a04",
      "--chart-5": "#db2777",
      "--sidebar": "#f2f2f2",
      "--sidebar-foreground": "#171717",
      "--sidebar-primary": "#8c47ad",
      "--sidebar-primary-foreground": "#ffffff",
      "--sidebar-accent": "#e8e8e8",
      "--sidebar-accent-foreground": "#171717",
      "--sidebar-border": "#dddddd",
      "--sidebar-ring": "#9d53bc",
      "--markdown-code-background": "var(--card)",
    },
    dark: {
      "--background": "#000000",
      "--foreground": "#ededed",
      "--card": "var(--popover)",
      "--card-foreground": "#ededed",
      "--popover": "#181818",
      "--popover-foreground": "#ededed",
      "--primary": "#cf8fe6",
      "--primary-foreground": "#000000",
      "--primary-foreground-alt": "#bb6fd6",
      "--secondary": "#181818",
      "--secondary-foreground": "#ededed",
      "--muted": "#101010",
      "--muted-foreground": "#a3a3a3",
      "--accent": "#262626",
      "--accent-foreground": "#ededed",
      "--destructive": "#cc4848",
      "--border": "#262626",
      "--input": "#707070",
      "--ring": "#cf8fe6",
      "--chart-1": "#cf8fe6",
      "--chart-2": "#4e96cc",
      "--chart-3": "#93b373",
      "--chart-4": "#eaaf03",
      "--chart-5": "#d74397",
      "--sidebar": "#101010",
      "--sidebar-foreground": "#ededed",
      "--sidebar-primary": "#cf8fe6",
      "--sidebar-primary-foreground": "#000000",
      "--sidebar-accent": "#181818",
      "--sidebar-accent-foreground": "#ededed",
      "--sidebar-border": "#262626",
      "--sidebar-ring": "#cf8fe6",
      "--markdown-code-background": "var(--card)",
    },
  },
  rules: presetRules("nonanium", [
    "corners-seven",
    "page-background",
    "standard-control-corners",
    "primary-button-bordered",
    "primary-button-hover",
    "primary-action-gradient",
    "secondary-button-bordered",
    "secondary-button-hover",
    "input-fill",
    "input-hover",
    "input-focus-primary",
    "destructive-bordered",
    "ghost-hover-filled",
    "link-button-hover",
  ]),
};

const SECRET: Theme = {
  id: "secret",
  title: "Secret",
  logo: SECRET_LOGO,
  design: DEFAULT_THEME_DESIGN,
  customCss: `@keyframes secret-gold-sweep {
  0% { transform: translateX(-160%) skewX(-75deg); opacity: 0; }
  15%, 75% { opacity: 1; }
  100% { transform: translateX(360%) skewX(-75deg); opacity: 0; }
}`,
  tokens: {
    light: {
      "--secret-gold-light": "#ffe8b4",
      "--secret-gold-dark": "#b77c21",
      "--background": "#f7f4ef",
      "--foreground": "#302b27",
      "--card": "#fffdf9",
      "--card-foreground": "var(--foreground)",
      "--popover": "var(--card)",
      "--popover-foreground": "var(--foreground)",
      "--primary": "#f9b637",
      "--primary-foreground": "#24120c",
      "--primary-foreground-alt": "#c04b00",
      "--secondary": "#e1d3df",
      "--secondary-foreground": "var(--foreground)",
      "--muted": "#eee8e1",
      "--muted-foreground": "#70645d",
      "--accent": "#e9e0e7",
      "--accent-foreground": "var(--foreground)",
      "--destructive": "#b93632",
      "--destructive-foreground": "#fffaf2",
      "--border": "#dfd6cd",
      "--input": "#b7aaa3",
      "--ring": "var(--primary)",
      "--chart-1": "var(--primary)",
      "--chart-2": "#c04b00",
      "--chart-3": "#8c5d78",
      "--chart-4": "#aa1c41",
      "--chart-5": "#8a603b",
      "--sidebar": "#eee8e1",
      "--sidebar-foreground": "var(--foreground)",
      "--sidebar-primary": "var(--primary)",
      "--sidebar-primary-foreground": "var(--primary-foreground)",
      "--sidebar-accent": "var(--accent)",
      "--sidebar-accent-foreground": "var(--foreground)",
      "--sidebar-border": "var(--border)",
      "--sidebar-ring": "var(--ring)",
      "--markdown-code-background": "var(--card)",
    },
    dark: {
      "--secret-gold-light": "#ffe8b4",
      "--secret-gold-dark": "#b77c21",
      "--background": "#11100f",
      "--foreground": "#eee8de",
      "--card": "#1d1b19",
      "--card-foreground": "var(--foreground)",
      "--popover": "#25211f",
      "--popover-foreground": "var(--foreground)",
      "--primary": "#f9b637",
      "--primary-foreground": "#24120c",
      "--primary-foreground-alt": "#fb6c00",
      "--secondary": "#393039",
      "--secondary-foreground": "var(--foreground)",
      "--muted": "#25221f",
      "--muted-foreground": "#b8ada3",
      "--accent": "#40353f",
      "--accent-foreground": "var(--foreground)",
      "--destructive": "#f26d50",
      "--destructive-foreground": "#24120c",
      "--border": "#3b3530",
      "--input": "#665c55",
      "--ring": "var(--primary)",
      "--chart-1": "var(--primary)",
      "--chart-2": "#e68457",
      "--chart-3": "#d7a8c9",
      "--chart-4": "#aa1c41",
      "--chart-5": "#b98b50",
      "--sidebar": "#181614",
      "--sidebar-foreground": "var(--foreground)",
      "--sidebar-primary": "var(--primary)",
      "--sidebar-primary-foreground": "var(--primary-foreground)",
      "--sidebar-accent": "var(--accent)",
      "--sidebar-accent-foreground": "var(--foreground)",
      "--sidebar-border": "var(--border)",
      "--sidebar-ring": "var(--ring)",
      "--markdown-code-background": "var(--card)",
    },
  },
  rules: [
    ...presetRules("secret", ["ghost-hover-muted", "corners-medium"]),
    {
      id: "secret-gold-button",
      label: "Gold bar button",
      layer: "theme",
      group: "Buttons",
      mode: "both",
      selector: '[data-ui-button][data-variant="default"]',
      declarations: `position: relative;
overflow: hidden;
background-image: linear-gradient(165deg, var(--secret-gold-light) 0%, var(--primary) 30%, var(--secret-gold-light) 45%, var(--primary) 52%, var(--secret-gold-dark) 68%, var(--primary) 82%, var(--secret-gold-light) 96%, var(--primary) 100%) !important;
border: 1px solid var(--secret-gold-dark) !important;
box-shadow: inset 0 0 0 1px rgb(255 232 180 / 40%), 0 2px 0 var(--secret-gold-dark), 0 4px 8px rgb(36 18 12 / 20%) !important;
text-shadow: 0 1px rgb(255 232 180 / 35%);`,
    },
    {
      id: "secret-gold-light",
      label: "Gold shine",
      group: "Buttons",
      mode: "both",
      selector: '[data-ui-button][data-variant="default"]::before',
      declarations: `content: "";
position: absolute;
inset-block: 0;
left: 0;
width: 140%;
pointer-events: none;
background: linear-gradient(90deg, transparent, rgb(249 182 55 / 15%), rgb(255 232 180 / 75%), rgb(249 182 55 / 15%), transparent);
opacity: 0;
transform: translateX(-160%) skewX(-75deg);`,
    },
    {
      id: "secret-gold-interactive",
      label: "Gold shine on interaction",
      group: "Buttons",
      mode: "both",
      selector:
        '[data-ui-button][data-variant="default"]:not(:disabled):not([data-disabled]):is(:hover, :focus-visible)::before',
      declarations: `animation: secret-gold-sweep 2000ms ease-out both;
@media (prefers-reduced-motion: reduce) {
  animation: none;
  opacity: 0.45;
  transform: translateX(65%) skewX(-75deg);
}`,
    },
    {
      id: "secret-destructive-text",
      label: "Destructive text contrast",
      group: "Buttons",
      mode: "both",
      selector:
        ':is([data-ui-button], [data-slot="badge"])[data-variant="destructive"]',
      declarations: "color: var(--destructive-foreground) !important;",
    },
    {
      id: "secret-destructive-interactive",
      label: "Destructive interactive contrast",
      group: "Buttons",
      mode: "both",
      selector:
        ':is([data-ui-button], [data-slot="badge"])[data-variant="destructive"]:is(:hover, :focus-visible)',
      declarations:
        "background-color: color-mix(in srgb, var(--destructive) 90%, transparent) !important;",
    },
  ],
};

const BACKLOT: Theme = {
  id: "backlot",
  title: "Backlot",
  logo: BACKLOT_LOGO,
  design: DEFAULT_THEME_DESIGN,
  customCss: `@keyframes backlot-projector-sweep {
  0% { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
  15%, 75% { opacity: 1; }
  100% { transform: translateX(360%) skewX(-18deg); opacity: 0; }
}`,
  tokens: {
    light: {
      "--background": "#F7F5F0",
      "--foreground": "#252A2D",
      "--card": "#FFFDFC",
      "--card-foreground": "var(--foreground)",
      "--popover": "var(--card)",
      "--popover-foreground": "var(--foreground)",
      "--primary": "#536B77",
      "--primary-foreground": "#FFFFFF",
      "--primary-foreground-alt": "#435D6A",
      "--secondary": "#EAE7E0",
      "--secondary-foreground": "var(--foreground)",
      "--muted": "#EDECE6",
      "--muted-foreground": "#5F686B",
      "--accent": "#E3E9EA",
      "--accent-foreground": "var(--foreground)",
      "--destructive": "#B93632",
      "--border": "#DFE1DE",
      "--input": "#7D898B",
      "--ring": "var(--primary)",
      "--chart-1": "var(--primary)",
      "--chart-2": "#A47A47",
      "--chart-3": "#50766B",
      "--chart-4": "#756B82",
      "--chart-5": "#80715E",
      "--sidebar": "#EDECE6",
      "--sidebar-foreground": "var(--foreground)",
      "--sidebar-primary": "var(--primary)",
      "--sidebar-primary-foreground": "var(--primary-foreground)",
      "--sidebar-accent": "var(--accent)",
      "--sidebar-accent-foreground": "var(--foreground)",
      "--sidebar-border": "var(--border)",
      "--sidebar-ring": "var(--ring)",
      "--markdown-code-background": "var(--card)",
    },
    dark: {
      "--background": "#141819",
      "--foreground": "#E8E6E1",
      "--card": "#20272A",
      "--card-foreground": "var(--foreground)",
      "--popover": "#293134",
      "--popover-foreground": "var(--foreground)",
      "--primary": "#9AB2BC",
      "--primary-foreground": "#252A2D",
      "--primary-foreground-alt": "#B0C5CC",
      "--secondary": "#303638",
      "--secondary-foreground": "var(--foreground)",
      "--muted": "#262D2F",
      "--muted-foreground": "#A6B0B1",
      "--accent": "#344349",
      "--accent-foreground": "var(--foreground)",
      "--destructive": "#F08078",
      "--border": "#354145",
      "--input": "#73858A",
      "--ring": "var(--primary)",
      "--chart-1": "var(--primary)",
      "--chart-2": "#C49A65",
      "--chart-3": "#91B4A6",
      "--chart-4": "#B0A4BD",
      "--chart-5": "#BBAE96",
      "--sidebar": "#191F21",
      "--sidebar-foreground": "var(--foreground)",
      "--sidebar-primary": "var(--primary)",
      "--sidebar-primary-foreground": "var(--primary-foreground)",
      "--sidebar-accent": "var(--accent)",
      "--sidebar-accent-foreground": "var(--foreground)",
      "--sidebar-border": "var(--border)",
      "--sidebar-ring": "var(--ring)",
      "--markdown-code-background": "var(--card)",
    },
  },
  rules: [
    ...presetRules("backlot", ["ghost-hover-muted", "corners-medium"]),
    {
      id: "backlot-projector-button",
      label: "Projector button frame",
      group: "Buttons",
      mode: "both",
      selector: '[data-ui-button][data-variant="default"]',
      declarations: "position: relative; overflow: hidden;",
    },
    {
      id: "backlot-button-bevel",
      label: "Film equipment button edge",
      group: "Buttons",
      mode: "both",
      selector: '[data-ui-button][data-variant="default"]',
      declarations:
        "--tw-inset-shadow: inset 0 1px rgb(185 220 255 / 50%), inset 0 -2px rgb(10 20 28 / 38%);",
    },
    {
      id: "backlot-projector-light",
      label: "Projector light",
      group: "Buttons",
      mode: "both",
      selector: '[data-ui-button][data-variant="default"]::before',
      declarations: `content: "";
position: absolute;
inset-block: 0;
left: 0;
width: 45%;
pointer-events: none;
background: linear-gradient(90deg, transparent, rgb(185 220 255 / 22%), transparent);
opacity: 0;
transform: translateX(-160%) skewX(-18deg);`,
    },
    {
      id: "backlot-projector-interactive",
      label: "Projector sweep on interaction",
      group: "Buttons",
      mode: "both",
      selector:
        '[data-ui-button][data-variant="default"]:not(:disabled):not([data-disabled]):is(:hover, :focus-visible)::before',
      declarations: `animation: backlot-projector-sweep 650ms ease-out both;
@media (prefers-reduced-motion: reduce) {
  animation: none;
  opacity: 0.45;
  transform: translateX(65%) skewX(-18deg);
}`,
    },
    // Keep button text contrast when the shared variants fade their fills.
    {
      id: "backlot-primary-interactive",
      label: "Primary interactive contrast",
      group: "Buttons",
      mode: "both",
      selector:
        '[data-ui-button][data-variant="default"]:is(:hover, :focus-visible, [aria-expanded="true"])',
      declarations:
        "background-color: var(--primary-foreground-alt) !important;",
    },
    {
      id: "backlot-destructive-text",
      label: "Destructive text contrast",
      group: "Buttons",
      mode: "both",
      selector:
        ':is([data-ui-button], [data-slot="badge"])[data-variant="destructive"]',
      declarations: "color: var(--primary-foreground) !important;",
    },
    {
      id: "backlot-destructive-interactive",
      label: "Destructive interactive contrast",
      group: "Buttons",
      mode: "both",
      selector:
        ':is([data-ui-button], [data-slot="badge"])[data-variant="destructive"]:is(:hover, :focus-visible)',
      declarations:
        "background-color: color-mix(in srgb, var(--destructive) 90%, transparent) !important;",
    },
  ],
};

export const BUILT_IN_THEMES: readonly Theme[] = Object.freeze([
  TENSAMIN,
  OG_TENSAMIN,
  NONANIUM,
  SECRET,
  BACKLOT,
]);

export { BUILT_IN_THEME_IDS };

/** Id of the theme used when nothing else is configured. */
export const FALLBACK_THEME_ID = "nonanium";

export function isBuiltinThemeId(id: string | null | undefined): id is string {
  return id !== null && id !== undefined && BUILT_IN_THEME_IDS.includes(id);
}

export function findTheme(
  themes: readonly Theme[],
  id: string | null | undefined,
) {
  return id ? (themes.find((theme) => theme.id === id) ?? null) : null;
}
