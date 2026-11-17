import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "../lib/utils.js";

const separatorClassName = "shrink-0 bg-border";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        separatorClassName,
        "data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className,
      )}
      {...props}
    />
  );
}

export { Separator, separatorClassName };
