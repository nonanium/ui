import type { ThemeModeScope, ThemeRule } from "./types";

function rule(
  id: string,
  label: string,
  group: string,
  mode: ThemeModeScope,
  selector: string,
  declarations: string,
  layer?: string,
): ThemeRule {
  return {
    id,
    label,
    group,
    mode,
    selector,
    declarations: declarations.trim(),
    ...(layer ? { layer } : {}),
  };
}

export function createRuleId() {
  return `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Reusable style rules that themes are composed from. The built-in presets
 * reference these, and users can add copies of them to custom themes.
 */
export const RULE_PRESETS: readonly ThemeRule[] = Object.freeze([
  // Corners
  rule(
    "corners-seven",
    "Seven pixel corners",
    "Corners",
    "both",
    "&",
    `--radius: 7px;`,
  ),
  rule(
    "standard-control-corners",
    "Standard control corners",
    "Corners",
    "both",
    `:where([data-ui-button], [data-slot="input"], [data-slot="textarea"], [data-slot="native-select"], [data-slot="select-trigger"], [data-slot="input-group"], [data-slot="checkbox"], [data-slot="toggle"], [data-slot="tabs-list"], [data-slot="tabs-trigger"], [data-slot="card"], [data-slot="dialog-content"], [data-slot="alert-dialog-content"], [data-slot="popover-content"], [data-slot="hover-card-content"], [data-slot="select-content"], [data-slot="combobox-content"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-sub-content"], [data-slot="context-menu-content"], [data-slot="context-menu-sub-content"], [data-slot="menubar-content"], [data-slot="menubar-sub-content"]):not(.rounded-full)`,
    `border-radius: var(--radius);`,
  ),
  rule(
    "corners-sharp",
    "Sharp corners",
    "Corners",
    "both",
    "&",
    `--radius: 0rem;`,
  ),
  rule(
    "corners-small",
    "Small corners",
    "Corners",
    "both",
    "&",
    `--radius: 0.25rem;`,
  ),
  rule(
    "corners-medium",
    "Medium corners",
    "Corners",
    "both",
    "&",
    `--radius: 0.5rem;`,
  ),
  rule(
    "corners-round",
    "Round corners",
    "Corners",
    "both",
    "&",
    `--radius: 0.75rem;`,
  ),
  rule(
    "squared-controls",
    "Control radius & border style",
    "Controls",
    "both",
    `:where([data-slot="card"], [data-ui-button], [data-slot="input"], [data-slot="textarea"], [data-slot="native-select"], [data-slot="select-trigger"], [data-slot="input-group"], [data-slot="dialog-content"], [data-slot="alert-dialog-content"], [data-slot="popover-content"])`,
    `border-radius: var(--radius);
border-style: solid;`,
  ),

  // Motion
  rule(
    "no-animations",
    "No animations or transitions",
    "Motion",
    "both",
    "*:not(.loading-line-wobble), *::before, *::after",
    `transition: none !important;
animation: none !important;
scroll-behavior: auto !important;`,
  ),

  // Layout
  rule(
    "page-background",
    "Page background",
    "Layout",
    "both",
    "body",
    `background-color: var(--background);`,
  ),
  rule(
    "separator-gradient",
    "Separator gradient",
    "Layout",
    "both",
    `[data-slot="separator"]`,
    `background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 42%, var(--border)), transparent);`,
  ),
  rule(
    "compact-spacing",
    "Compact spacing",
    "Layout",
    "both",
    "&",
    `--ui-spacing: 0.875;\n--ui-density: 0.875;`,
  ),
  rule(
    "roomy-spacing",
    "Roomy spacing",
    "Layout",
    "both",
    "&",
    `--ui-spacing: 1.125;\n--ui-density: 1.125;`,
  ),
  rule(
    "thick-borders",
    "Thick borders",
    "Layout",
    "both",
    "&",
    `--ui-border-width: 2px;`,
  ),

  // Buttons
  rule(
    "primary-action-gradient",
    "Primary action gradient",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="default"]`,
    `position: relative;
background-image: radial-gradient(ellipse 90% 160% at 50% -100%, #fff 35%, rgb(255 255 255 / 32%) 65%, rgb(255 255 255 / 10%) 82%, transparent 100%) !important;
&::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px !important;
  border-radius: inherit;
  background: radial-gradient(ellipse 65% 150% at 50% 0%, rgb(255 255 255 / 16%), rgb(255 255 255 / 8%) 40%, rgb(255 255 255 / 3%) 70%, transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}`,
    "theme",
  ),
  rule(
    "chonky-buttons",
    "Chonky buttons",
    "Buttons",
    "both",
    `[data-ui-button]`,
    `min-height: 0;
font-weight: 500;
border-radius: var(--radius);
padding-inline: calc(1.35rem * var(--ui-density));
transition-duration: 100ms;`,
  ),
  rule(
    "button-press-offset",
    "Button press offset",
    "Buttons",
    "both",
    `[data-ui-button]:active`,
    `translate: none;`,
  ),
  rule(
    "button-height-xs",
    "Extra small button height",
    "Buttons",
    "both",
    `[data-ui-button][data-size="xs"]`,
    `height: calc(2rem * var(--ui-density));`,
  ),
  rule(
    "button-height-lg",
    "Large button height",
    "Buttons",
    "both",
    `[data-ui-button][data-size="lg"]`,
    `height: calc(2.5rem * var(--ui-density));`,
  ),
  rule(
    "button-padding-small",
    "Small button horizontal padding",
    "Buttons",
    "both",
    `[data-ui-button][data-size="sm"]:not([data-size^="icon"]),
[data-ui-button][data-size="xs"]:not([data-size^="icon"])`,
    `padding-inline: calc(1.25rem * var(--ui-density));`,
  ),
  rule(
    "ghost-hover-muted",
    "Muted ghost hover",
    "Buttons",
    "both",
    `[data-ui-button]:is([data-variant="ghost"], [data-variant="secondary"]):is(:hover, [aria-current="page"])`,
    `background-color: color-mix(in srgb, var(--foreground) 11%, var(--background)) !important;`,
    "theme",
  ),
  rule(
    "ghost-hover-filled",
    "Ghost hover (filled)",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="ghost"]:hover`,
    `background-color: var(--secondary);`,
  ),
  rule(
    "primary-button-bordered",
    "Bordered primary button",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="default"]`,
    `background-color: var(--primary);
color: var(--primary-foreground);
border: var(--ui-border-width) solid var(--primary);`,
  ),
  rule(
    "primary-button-hover",
    "Primary button hover",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="default"]:hover`,
    `background-color: var(--primary-foreground-alt);
border: var(--ui-border-width) solid var(--primary);`,
  ),
  rule(
    "secondary-button-bordered",
    "Bordered secondary button",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="secondary"]`,
    `background-color: var(--secondary);
border-color: color-mix(in srgb, white 16%, transparent);
color: var(--secondary-foreground);`,
  ),
  rule(
    "secondary-button-hover",
    "Secondary button hover",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="secondary"]:hover`,
    `background-color: var(--secondary);
border-color: color-mix(in srgb, var(--ring) 60%, transparent);`,
  ),
  rule(
    "link-button-hover",
    "Link button hover",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="link"]:hover`,
    `background-color: transparent;
border-color: color-mix(in srgb, var(--ring) 60%, transparent);`,
  ),
  rule(
    "destructive-bordered",
    "Bordered destructive variant",
    "Buttons",
    "both",
    `[data-slot][data-variant="destructive"]`,
    `border: var(--ui-border-width) solid var(--destructive);`,
  ),
  rule(
    "outline-link-fill",
    "Outline & link fill",
    "Buttons",
    "both",
    `:where(
  [data-ui-button][data-variant="outline"],
  [data-ui-button][data-variant="link"],
  [data-slot="badge"][data-variant="outline"],
  [data-slot="toggle"][data-variant="outline"]
)`,
    `background-color: var(--secondary);
border-color: transparent;
color: var(--secondary-foreground);`,
  ),
  rule(
    "link-button-overlay",
    "Link button overlay",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="link"]`,
    `background-image: none;`,
  ),
  rule(
    "link-button-hover-flat",
    "Link button hover (flat)",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="link"]:hover`,
    `background-color: var(--secondary);
background-image: none;`,
  ),
  rule(
    "ghost-button-overlay",
    "Ghost button overlay",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="ghost"]`,
    `background-image: none;`,
  ),
  rule(
    "ghost-button-hover-overlay",
    "Ghost button hover overlay",
    "Buttons",
    "both",
    `[data-ui-button][data-variant="ghost"]:hover`,
    `background-image: linear-gradient(to top, rgb(255 255 255 / 12%), rgb(255 255 255 / 2%));`,
  ),
  rule(
    "outline-hover-light",
    "Outline hover (light)",
    "Buttons",
    "light",
    `:where(
  [data-ui-button],
  [data-slot="badge"],
  [data-slot="toggle"]
)[data-variant="outline"]:is(
  :hover,
  :focus-visible,
  [aria-expanded="true"],
  [data-popup-open],
  [data-open]
)`,
    `background-color: color-mix(in srgb, var(--secondary) 82%, #622a53 18%);
border-color: transparent;
color: var(--secondary-foreground);`,
  ),
  rule(
    "outline-hover-dark",
    "Outline hover (dark)",
    "Buttons",
    "dark",
    `:where(
  [data-ui-button],
  [data-slot="badge"],
  [data-slot="toggle"]
)[data-variant="outline"]:is(
  :hover,
  :focus-visible,
  [aria-expanded="true"],
  [data-popup-open],
  [data-open]
)`,
    `background-color: color-mix(in srgb, var(--secondary) 82%, #24120c 18%);
border-color: transparent;
color: var(--secondary-foreground);`,
  ),

  // Controls
  rule(
    "control-height-small",
    "Small control height",
    "Controls",
    "both",
    `:where([data-ui-button], [data-slot="select-trigger"])[data-size="sm"]`,
    `height: calc(2.125rem * var(--ui-density));`,
  ),
  rule(
    "control-height-default",
    "Default control height",
    "Controls",
    "both",
    `:where([data-ui-button], [data-slot="select-trigger"])[data-size="default"],
:where([data-slot="input"], [data-slot="native-select"], [data-slot="input-group"])`,
    `height: calc(2.25rem * var(--ui-density));`,
  ),
  rule(
    "glossy-controls",
    "Glossy overlay",
    "Controls",
    "both",
    `:where(
  [data-ui-button],
  [data-slot="toggle"],
  [data-slot="input"],
  [data-slot="textarea"],
  [data-slot="native-select"],
  [data-slot="select-trigger"],
  [data-slot="input-group"],
  [data-slot="checkbox"],
  [data-slot="radio-group-item"],
  [data-slot="switch"]
)`,
    `background-image: linear-gradient(to top, rgb(255 255 255 / 12%), rgb(255 255 255 / 2%));
background-repeat: no-repeat;`,
  ),

  // Inputs
  rule(
    "input-padding",
    "Input horizontal padding",
    "Inputs",
    "both",
    `:where([data-slot="input"], [data-slot="native-select"], [data-slot="select-trigger"])`,
    `padding-inline: calc(1rem * var(--ui-density));`,
  ),
  rule(
    "textarea-padding",
    "Textarea padding",
    "Inputs",
    "both",
    `[data-slot="textarea"]`,
    `padding: calc(0.785rem * var(--ui-density)) calc(1rem * var(--ui-density));`,
  ),
  rule(
    "input-fill",
    "Input & outline fill",
    "Inputs",
    "both",
    `:where([data-slot="input"], [data-slot="textarea"], [data-slot="native-select"], [data-slot="select-trigger"], [data-slot="input-group"], [data-ui-button][data-variant="outline"])`,
    `background-color: color-mix(in srgb, var(--input) 55%, var(--background));
border-color: var(--input);
color: var(--foreground);
transition: background-color 100ms ease, border-color 100ms ease;`,
  ),
  rule(
    "input-hover",
    "Input & outline hover",
    "Inputs",
    "both",
    `:where([data-slot="input"], [data-slot="textarea"], [data-slot="native-select"], [data-slot="select-trigger"], [data-slot="input-group"], [data-ui-button][data-variant="outline"]):not(:disabled):not([data-disabled]):not(:has(:disabled)):hover`,
    `background-color: color-mix(in srgb, var(--input) 55%, var(--background));
border-color: color-mix(in srgb, var(--input) 75%, var(--foreground) 25%);`,
  ),
  rule(
    "input-focus-primary",
    "Input focus border",
    "Inputs",
    "both",
    `[data-slot="input"]:not(:disabled):focus,
[data-slot="input"]:not(:disabled):focus:hover`,
    `border-color: var(--primary);`,
  ),

  // Menus
  rule(
    "popup-colors",
    "Popup colors",
    "Menus",
    "both",
    `:where([data-slot="select-content"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-sub-content"], [data-slot="context-menu-content"], [data-slot="context-menu-sub-content"], [data-slot="menubar-content"], [data-slot="menubar-sub-content"], [data-slot="combobox-content"], [data-slot="popover-content"], [data-slot="hover-card-content"])`,
    `background-color: var(--popover);
border-color: var(--border);
color: var(--popover-foreground);`,
  ),
  rule(
    "menu-item-highlight",
    "Highlighted item colors",
    "Menus",
    "both",
    `:where([data-slot="select-item"], [data-slot="dropdown-menu-item"], [data-slot="dropdown-menu-checkbox-item"], [data-slot="dropdown-menu-radio-item"], [data-slot="dropdown-menu-sub-trigger"], [data-slot="context-menu-item"], [data-slot="context-menu-checkbox-item"], [data-slot="context-menu-radio-item"], [data-slot="context-menu-sub-trigger"], [data-slot="menubar-item"], [data-slot="menubar-checkbox-item"], [data-slot="menubar-radio-item"], [data-slot="menubar-sub-trigger"]):focus,
[data-slot="combobox-item"][data-highlighted],
[data-slot="command-item"][data-selected]`,
    `background-color: var(--accent);
color: var(--accent-foreground);`,
  ),

  // Cards
  rule(
    "card-section-padding",
    "Card section padding",
    "Cards",
    "both",
    `:where([data-slot="card-header"], [data-slot="card-content"], [data-slot="card-footer"])`,
    `padding-inline: calc(1rem * var(--ui-density));`,
  ),
  rule(
    "card-frame",
    "Card frame",
    "Cards",
    "both",
    `[data-slot="card"]`,
    `padding-block: calc(1rem * var(--ui-density));
border: var(--ui-border-width) solid var(--input);
background-color: color-mix(in srgb, var(--input) 55%, var(--background));`,
  ),
  rule(
    "card-background",
    "Card background",
    "Cards",
    "both",
    `[data-slot="card"]`,
    `background: var(--card);`,
  ),

  // Tabs
  rule(
    "switch-radius",
    "Two-option switch corner radius",
    "Tabs",
    "both",
    `[role="tablist"].grid.grid-cols-2.bg-card.rounded-4xl,
[role="tablist"].grid.grid-cols-2.bg-card.rounded-4xl > .rounded-4xl`,
    `border-radius: var(--radius) !important;`,
  ),
  rule(
    "switch-tab-color",
    "Unselected tab color",
    "Tabs",
    "both",
    `[role="tablist"].grid.grid-cols-2.bg-card.rounded-4xl > [role="tab"][aria-selected="false"]`,
    `color: color-mix(in srgb, var(--muted-foreground) 75%, black);`,
  ),

  // Icons
  rule(
    "icon-primary",
    "Primary-colored icons",
    "Icons",
    "both",
    `:where(
  [data-slot="card-title"],
  [data-slot="item-media"][data-variant="icon"],
  [data-slot="badge"][data-variant="outline"]
) svg`,
    `color: var(--primary);`,
  ),
]);

export function findRulePreset(id: string) {
  return RULE_PRESETS.find((preset) => preset.id === id) ?? null;
}

/** Returns a fresh, editable copy of a rule preset for a theme. */
export function copyRulePreset(id: string): ThemeRule | null {
  const preset = findRulePreset(id);
  return preset ? { ...preset, id: createRuleId() } : null;
}
