import { Popover as Primitive } from "@base-ui/react/popover";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function Hint({ onOpenChange, ...props }: ComponentProps<typeof Popover>) {
  return (
    <Popover
      {...props}
      onOpenChange={(open, details) => {
        if (
          !open &&
          details.reason !== "escape-key" &&
          details.reason !== "close-press" &&
          details.reason !== "imperative-action"
        ) {
          details.cancel();
          return;
        }
        onOpenChange?.(open, details);
      }}
    />
  );
}

function HintContent({
  children,
  className,
  onAcknowledge,
  acknowledgeLabel = "Got it",
  ...props
}: ComponentProps<typeof PopoverContent> & {
  onAcknowledge?: () => void;
  acknowledgeLabel?: ReactNode;
}) {
  return (
    <PopoverContent
      side="top"
      sideOffset={10}
      className={cn(
        "w-64 max-w-[calc(100vw-2rem)] gap-2.5 bg-primary p-2.5 text-sm text-primary-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <Primitive.Close
        render={<Button variant="secondary" size="sm" className="w-full" />}
        onClick={onAcknowledge}
      >
        {acknowledgeLabel}
      </Primitive.Close>
      <Primitive.Arrow className="size-2.5 rotate-45 rounded-[2px] bg-primary data-[side=top]:-bottom-1 data-[side=bottom]:-top-1 data-[side=left]:-right-1 data-[side=right]:-left-1" />
    </PopoverContent>
  );
}

export { Hint, HintContent, PopoverTrigger as HintTrigger };
