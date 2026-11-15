"use client";

import { useInteractionSound, type SoundProps } from "../sounds";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg border-0! bg-none! text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted focus-visible:bg-muted hover:text-foreground focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "bg-input/30 hover:bg-input/50 focus-visible:bg-input/50 dark:bg-input/30 dark:hover:bg-input/50 dark:focus-visible:bg-input/50",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  sound,
  onClick,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants> & SoundProps) {
  const play = useInteractionSound("toggle", sound);

  return (
    <TogglePrimitive
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      className={cn(toggleVariants({ variant, size, className }))}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !props.disabled) play("toggle");
      }}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
