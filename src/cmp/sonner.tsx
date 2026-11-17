"use client";

import { useTheme } from "../theme/Provider";
import { useEffect, useRef } from "react";
import { Toaster as Sonner, useSonner, type ToasterProps } from "sonner";
import { useInteractionSound } from "../sounds";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedPolarity } = useTheme();
  const { toasts } = useSonner();
  const play = useInteractionSound("toast");
  const previousErrors = useRef(new Set<string | number>());

  useEffect(() => {
    const errors = new Set(
      toasts
        .filter(
          (toast) => toast.type === "error" && toast.toasterId === props.id,
        )
        .map((toast) => toast.id),
    );
    if ([...errors].some((id) => !previousErrors.current.has(id)))
      play("error");
    previousErrors.current = errors;
  }, [toasts, props.id, play]);

  return (
    <Sonner
      theme={resolvedPolarity}
      className="toaster group"
      offset={{
        top: "max(1rem, var(--ui-safe-area-top))",
        right: "max(1rem, var(--ui-safe-area-right))",
        bottom: "max(1rem, var(--ui-safe-area-bottom))",
        left: "max(1rem, var(--ui-safe-area-left))",
      }}
      mobileOffset={{
        top: "max(1rem, var(--ui-safe-area-top))",
        right: "max(1rem, var(--ui-safe-area-right), var(--ui-safe-area-left))",
        bottom: "max(1rem, var(--ui-safe-area-bottom))",
        left: "max(1rem, var(--ui-safe-area-right), var(--ui-safe-area-left))",
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
