import React from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { XCircleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Spinner,
  Text,
  ToastContextBaseProps,
  useToast,
} from "@waitingonalice/design-system";
import { AuthLayout, Link } from "@/components";
import { clientRoutes } from "@/constants";
import { useResendEmail } from "../register/loaders/register";

export function ErrorToken() {
  const router = useRouter();
  const [resendEmail, resendEmailOptions] = useResendEmail();
  const { renderToast } = useToast();
  const { id, email } = router.query;
  const isExpired = Number(id) === 401004;
  const errorMessage = () => {
    if (isExpired) {
      return "The verification link has expired. Click the button below to resend the verification email.";
    }
    return "Invalid request. Please try again.";
  };

  const handleResend = async () => {
    const toastProps: ToastContextBaseProps = {
      key: uuid(),
      show: true,
      position: "bottom-right",
      title: "",
      variant: "success",
    };
    try {
      const data = await resendEmail(decodeURIComponent(email as string));
      if (!data) return;
      renderToast({
        ...toastProps,
        title: "Verification email has been sent.",
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
    <AuthLayout>
      <div className="flex flex-col p-8 gap-y-4 items-center justify-center text-center">
        <XCircleIcon className="w-20 h-auto text-error-main" />
        <Text type="subhead-2-bold">{errorMessage()}</Text>
        {isExpired && (
          <Button onClick={handleResend} size="small">
            {resendEmailOptions.isLoading ? (
              <Spinner />
            ) : (
              "Resend verification email"
            )}
          </Button>
        )}
        <Link to={clientRoutes.auth.login}>Back to Login page</Link>
      </div>
    </AuthLayout>
  );
}
