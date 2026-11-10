import {
  CircleCheck,
  Info,
  Loader2,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { toast, type ExternalToast, type ToasterProps } from "sonner";
import { Toaster } from "./sonner";

const toasterId = "nonanium-notifications";

export const notify = Object.assign(
  (
    kind: "success" | "error" | "info" | "warning" | "loading",
    message: string,
    description?: string,
    options?: Omit<ExternalToast, "toasterId" | "description">,
  ) => toast[kind](message, { ...options, description, toasterId }),
  { dismiss: toast.dismiss },
);

export function NotificationToaster(props: Omit<ToasterProps, "id">) {
  return (
    <Toaster
      {...props}
      id={toasterId}
      icons={{
        success: <CircleCheck className="size-6" />,
        error: <OctagonX className="size-6" />,
        info: <Info className="size-6" />,
        warning: <TriangleAlert className="size-6" />,
        loading: <Loader2 className="size-6 animate-spin" />,
        ...props.icons,
      }}
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...props.toastOptions?.classNames,
          icon: "size-6! shrink-0 [&_svg]:size-6!",
        },
      }}
    />
  );
}
