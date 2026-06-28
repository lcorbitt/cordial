import { MESSAGE_CLASS } from "./field-error/constants";

/**
 * Inline form field error. Uses `role="alert"` so screen readers announce
 * validation problems as they appear.
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className={MESSAGE_CLASS}>
      {message}
    </p>
  );
}
