import React from "react";
import { AxiosError } from "axios";
import { v4 as uuid } from "uuid";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Spinner,
  Text,
  ToastContextBaseProps,
  useToast,
} from "@waitingonalice/design-system";
import { Link } from "@/components";
import { clientRoutes } from "@/constants";
import { useResendEmail } from "../loaders/register";

interface RegistrationSuccessProps {
  email: string;
}
function RegistrationSuccess({ email }: RegistrationSuccessProps) {
  const [resend, resendOptions] = useResendEmail();
  const { renderToast } = useToast();

  const handleResend = async () => {
    const toastProps: ToastContextBaseProps = {
      key: uuid(),
      show: true,
      position: "bottom-right",
      title: "",
      variant: "success",
    };
    try {
      const data = await resend(email);
      if (!data) return;
      renderToast({
        ...toastProps,
        title: "Verification email has been resent.",
        variant: "success",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const code = err.response?.data.detail;
        renderToast({
          ...toastProps,
          title:
            code === 400000
              ? "Account has already been verified."
              : "An unexpected error occurred, please try again later.",
          variant: code === 400000 ? "success" : "error",
        });
      }
    }
  };
  return (
    <div className="flex flex-col gap-y-4 items-center justify-center text-center p-8">
      <CheckCircleIcon className="w-20 h-auto text-success-dark" />
      <Text type="subhead-1">Registration Success!</Text>
      <Text type="subhead-2-bold">
        A verification email has been sent to your email address.
      </Text>
      <div className="flex gap-y-2 flex-col">
        <Text type="body">Did not receive an email?</Text>
        <Button onClick={handleResend} size="small">
          {resendOptions.isLoading ? <Spinner /> : "Resend email verification"}
        </Button>
      </div>
      <Link to={clientRoutes.auth.login}>Back to Login page</Link>
    </div>
  );
}

export default RegistrationSuccess;
