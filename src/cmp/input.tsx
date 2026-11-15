import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useTypingSound, type SoundProps } from "../sounds";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { controlVariantClasses } from "./control-variants";

const inputVariants = cva(
  "h-8 w-full min-w-0 rounded-lg border-0! px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40",
  {
    variants: { variant: controlVariantClasses },
    defaultVariants: { variant: "outline" },
  },
);

function Input({
  className,
  sound,
  type,
  variant = "outline",
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants> &
  SoundProps) {
  const onInput = useTypingSound(sound);
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(inputVariants({ variant }), className)}
      {...mergeProps({ onInput }, props)}
    />
  );
}

export { Input, inputVariants };
