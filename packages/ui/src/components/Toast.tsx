import React, { type PropsWithChildren, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { warning, success } from "@/assets";
import "./Toast.css";

const icons = {
  warning,
  success,
} as const;

export type ToastVariant = keyof typeof icons;

interface ToastProps extends PropsWithChildren {
  isOpen: boolean;
  close: () => void;
  exit: () => void;
  resolve: () => void;
  children: string;
  variant?: ToastVariant;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  exit,
  close,
  resolve,
  variant = "warning",
  children,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      close();
      resolve();
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence onExitComplete={exit}>
      {isOpen && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
        >
          <div>
            <img src={icons[variant]} />
            <span>{children}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
