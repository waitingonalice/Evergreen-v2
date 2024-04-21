import React, { useState } from "react";
import { AxiosError } from "axios";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Form,
  FormInput,
  Link,
  Spinner,
  Text,
  useForm,
  useToast,
} from "@waitingonalice/design-system";
import { AuthLayout } from "@/components";
import { clientRoutes } from "@/constants";
import { useForgotPassword } from "./loaders/forgotPassword";

export function ForgotPassword() {
  const [form, setForm] = useState({ email: "" });
  const { renderToast } = useToast();
  const { validate, onSubmit, errors } = useForm({
    data: form,
    zod: z.object({
      email: z.string().email({ message: "Invalid email address provided." }),
    }),
  });

  const [triggerForgotPassword, forgotPasswordOptions] = useForgotPassword();

  const handleOnChange = (value: string) => {
    validate("email", value);
    setForm((prev) => ({ ...prev, email: value }));
  };

  const handleSubmit = () => {
    const success = onSubmit();
    if (!success) return;
    triggerForgotPassword(form).catch((err) => {
      if (err instanceof AxiosError) {
        const message = () => {
          switch (err.response?.data?.detail) {
            case 400000:
              return "Email address not found";
            default:
              return "An error occurred. Please try again later.";
          }
        };
        renderToast({
          variant: "error",
          show: true,
          title: message(),
          key: uuid(),
        });
      }
    });
  };

  return (
    <AuthLayout title="Forgot Password">
      {forgotPasswordOptions.data?.result ? (
        <div className="flex flex-col items-center justify-center p-8 gap-y-4 text-center">
          <CheckCircleIcon className="w-20 h-auto text-success-dark" />
          <Text type="subhead-2-bold">
            A confirmation email has been sent to the specified email address.
          </Text>
          <Link to={clientRoutes.auth.login}>Back to Login page</Link>
        </div>
      ) : (
        <>
          <Text type="subhead-2-bold">
            Enter your email address that you have registered your account with.
          </Text>
          <Form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-y-4">
            <FormInput
              value={form.email}
              label="Email Address"
              required
              onChange={handleOnChange}
              showError={Boolean(errors.email)}
              errorMessage={errors.email}
            />

            <Button className="mt-4" type="submit">
              {forgotPasswordOptions.isLoading ? <Spinner /> : "Submit"}
            </Button>
            <Link to={clientRoutes.auth.login}>Back to Login page</Link>
          </Form>
        </>
      )}
    </AuthLayout>
  );
}
