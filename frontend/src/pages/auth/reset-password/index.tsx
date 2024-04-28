import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Form,
  FormInput,
  Spinner,
  Text,
  useForm,
  useToast,
} from "@waitingonalice/design-system";
import { AuthLayout, Link } from "@/components";
import { clientRoutes } from "@/constants";
import { useResetPassword } from "./loaders/resetPassword";

export function ResetPassword() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const { validate, onSubmit, errors } = useForm({
    data: form,
    zod: z.object({
      password: z
        .string()
        .min(8, { message: "Password should contain 8-14 characters." })
        .max(14, { message: "Password should contain 8-14 characters." }),
      confirmPassword: z.string().refine((data) => data === form.password, {
        message: "Passwords do not match.",
      }),
    }),
  });
  const { renderToast } = useToast();
  const [resetPassword, resetPasswordOptions] = useResetPassword();

  const handleOnChange = (key: string, value: string) => {
    validate(key, value);
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOnSubmit = () => {
    const success = onSubmit();
    if (!success) return;
    resetPassword({
      password: form.password,
      confirmPassword: form.confirmPassword,
      token: router.query.token as string,
    }).catch((err) => {
      if (err instanceof AxiosError) {
        renderToast({
          variant: "error",
          show: true,
          title:
            err.response?.data.detail === 401004 ||
            err.response?.data.detail === 401002
              ? "Request is invalid or has expired. Please try again."
              : "An error occurred. Please try again later.",
          key: uuid(),
          position: "bottom-right",
        });
      }
    });
  };

  return (
    <AuthLayout title="Set Password">
      {resetPasswordOptions.data?.result ? (
        <div className="flex flex-col gap-y-4 items-center justify-center text-center p-8">
          <CheckCircleIcon className="w-20 h-auto text-primary-dark" />
          <Text type="subhead-1">Password was successfully reset.</Text>
          <Link to={clientRoutes.auth.login}>Back to Login page</Link>
        </div>
      ) : (
        <Form className="flex flex-col gap-y-4" onSubmit={handleOnSubmit}>
          <Text type="subhead-2-bold">Please enter your new password</Text>
          <FormInput
            id="password"
            isPassword
            value={form.password}
            label="Password"
            required
            onChange={(value) => handleOnChange("password", value)}
            errorMessage={errors.password}
            showError={!!errors.password}
          />
          <FormInput
            isPassword
            value={form.confirmPassword}
            label="Confirm Password"
            required
            onChange={(value) => handleOnChange("confirmPassword", value)}
            errorMessage={errors.confirmPassword}
            showError={!!errors.confirmPassword}
          />
          <Button className="mt-4" type="submit">
            {resetPasswordOptions.isLoading ? <Spinner /> : "Submit"}
          </Button>
          <Link to={clientRoutes.auth.login}>Back to Login page</Link>
        </Form>
      )}
    </AuthLayout>
  );
}
