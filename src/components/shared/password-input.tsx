"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  PADDING_CLASS,
  ROOT_CLASS,
  TOGGLE_BUTTON_CLASS,
  TOGGLE_ICON_CLASS,
} from "./password-input/constants";

/**
 * Password field with a show/hide toggle. The toggle is a real button with an
 * accessible label so screen-reader and keyboard users can use it.
 */
const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={ROOT_CLASS}>
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(PADDING_CLASS, className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className={TOGGLE_BUTTON_CLASS}
      >
        {visible ? (
          <EyeOff className={TOGGLE_ICON_CLASS} />
        ) : (
          <Eye className={TOGGLE_ICON_CLASS} />
        )}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
