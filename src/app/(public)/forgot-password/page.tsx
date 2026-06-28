import { CENTER_WRAPPER_CLASS } from "../auth/constants";

import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className={CENTER_WRAPPER_CLASS}>
      <ForgotPasswordForm />
    </div>
  );
}
