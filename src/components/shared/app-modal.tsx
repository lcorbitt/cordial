"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  LG_CLASS,
  MD_CLASS,
  SM_CLASS,
  type AppModalSize,
} from "./app-modal/constants";

export type { AppModalSize };

export interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  size?: AppModalSize;
  hideFooter?: boolean;
}

function getAppModalSizeClass(size: AppModalSize): string {
  switch (size) {
    case "sm":
      return SM_CLASS;
    case "lg":
      return LG_CLASS;
    case "md":
    default:
      return MD_CLASS;
  }
}

/**
 * Consistent modal shell for confirm flows and custom content. Mount once via
 * ModalHost or use directly for static JSX modals.
 */
export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  size = "md",
  hideFooter = false,
}: AppModalProps) {
  function handleCancel() {
    onCancel?.();
    onOpenChange(false);
  }

  function handleConfirm() {
    onConfirm?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(getAppModalSizeClass(size))}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
        {!hideFooter && onConfirm ? (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
