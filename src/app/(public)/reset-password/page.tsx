import { CENTER_WRAPPER_CLASS } from "../auth/constants";

import { ResetPasswordForm } from "./components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className={CENTER_WRAPPER_CLASS}>
      <ResetPasswordForm />
    </div>
  );
}
