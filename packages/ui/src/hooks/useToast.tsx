import React from "react";
import { useOverlay } from "@toss/use-overlay";

import { Toast, type ToastVariant } from "@/components";

export const useToast = () => {
  const overlay = useOverlay();

  const openToast = (variant: ToastVariant, message: string) =>
    new Promise<void>(resolve =>
      overlay.open(props => (
        <Toast variant={variant} resolve={resolve} {...props}>
          {message}
        </Toast>
      )),
    );

  return { openToast };
};
