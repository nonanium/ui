export const controlVariantClasses = {
  default:
    "bg-secondary! bg-none! text-secondary-foreground! shadow-none! hover:bg-secondary/80! focus-visible:bg-secondary/80! aria-expanded:bg-secondary/80!",
  outline:
    "bg-input/30! bg-none! text-foreground! shadow-none! hover:bg-input/50! focus-visible:bg-input/50! aria-expanded:bg-input/50!",
  secondary:
    "bg-muted! bg-none! text-foreground! shadow-none! hover:bg-muted/80! focus-visible:bg-muted/80! aria-expanded:bg-muted/80!",
  ghost:
    "bg-transparent! bg-none! shadow-none! hover:bg-muted! focus-visible:bg-muted! aria-expanded:bg-muted!",
  destructive:
    "bg-destructive! bg-none! text-black! shadow-none! hover:bg-destructive/80! focus-visible:bg-destructive/80!",
  warning:
    "bg-amber-500! bg-none! text-amber-950! shadow-none! hover:bg-amber-500/80! focus-visible:bg-amber-500/80!",
  link: "bg-transparent! bg-none! text-primary! shadow-none! underline-offset-4 hover:underline focus-visible:underline",
} as const;

export type ControlVariant = keyof typeof controlVariantClasses;

// Shared surfaces and rows for consumers composing Base UI positioners themselves.
// These are the same visual recipes used by the select and dropdown primitives.
export const selectMenuRecipes = {
  popup: "rounded-lg border-0! bg-popover bg-none! text-popover-foreground shadow-md",
  item: "relative cursor-default rounded-md text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  label: "px-1.5 py-1 text-xs text-muted-foreground",
  separator: "-mx-1 my-1 h-px bg-border",
} as const;

// Composable dialog appearance; positioning, borders, and motion belong to
// the consumer so custom sheets and nested overlays can retain their geometry.
export const dialogRecipes = {
  overlay: "isolate",
  surface: "text-popover-foreground",
  header: "flex flex-col gap-2",
  footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  title: "font-heading leading-none",
  description: "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
} as const;

// Composable popup surfaces for consumers that provide their own positioning,
// dimensions and interaction behavior.
export const anchoredOverlayRecipes = {
  popover: "origin-(--transform-origin) rounded-lg text-popover-foreground",
  tooltip: "origin-(--transform-origin) rounded-md text-xs",
  hoverCard: "origin-(--transform-origin) rounded-lg text-popover-foreground",
} as const;
