import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import {
  Button,
  Checkbox,
  Form,
  FormInput,
  Link,
  Spinner,
  ToastContextBaseProps,
  useForm,
  useToast,
} from "@waitingonalice/design-system";
import { AuthLayout } from "@/components";
import { clientRoutes } from "@/constants";
import { setCookie } from "@/utils";
import { useLogin } from "./loaders/login";
import { loginSchema } from "./utils/validation";

function Login() {
  const router = useRouter();
  const { renderToast } = useToast();

  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const { onSubmit, validate, errors } = useForm({
    data: formInput,
    zod: loginSchema,
  });

  const [login, loginOptions] = useLogin();

  const handleOnChange = (key: string, value: string | boolean) => {
    if (typeof value === "string") validate(key, value);
    setFormInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    const success = onSubmit();
    if (!success) return;
    try {
      const data = await login(formInput);
      if (!data) return;
      setCookie("token", data.result.token);
      setCookie("refresh_token", data.result.refresh_token);
      router.push(clientRoutes.admin.dashboard);
    } catch (err) {
      console.error(err);
      const toastProps: ToastContextBaseProps = {
        show: true,
        key: uuid(),
        variant: "error",
        title: "",
      };
      if (err instanceof AxiosError) {
        const message = () => {
          const response = err.response?.data.detail;
          if (response === 400000) return "Invalid username or password.";
          if (response === 401006)
            return "Account is not verified, please check your email for the verification link.";
          return "Internal server error, please try again later.";
        };
        renderToast({
          ...toastProps,
          title: message(),
        });
      }
    }
  };

  useEffect(() => {
    const status = router.query["verify-status"];
    const toastProps: ToastContextBaseProps = {
      show: true,
      key: uuid(),
      variant: "success",
      title: "",
      position: "top-right",
    };
    if (!status) return;
    if (status === "ok") {
      renderToast({
        ...toastProps,
        title: "Email was successfully verified",
      });
    } else if (status === "error") {
      renderToast({
        ...toastProps,
        variant: "error",
        title: "Error verifying email",
      });
    }

    router.replace(clientRoutes.auth.login, undefined, { shallow: true });
  }, [router.query]);

  return (
    <AuthLayout title="Login">
      <Form onSubmit={handleLogin} className="flex flex-col gap-y-4">
        <FormInput
          id="username"
          label="Username"
          value={formInput.username}
          onChange={(val) => handleOnChange("username", val)}
          autoComplete="username"
          errorMessage={errors.username}
          showError={!!errors.username}
        />
        <FormInput
          id="password"
          label="Password"
          value={formInput.password}
          onChange={(val) => handleOnChange("password", val)}
          isPassword
          autoComplete="current-password"
          errorMessage={errors.password}
          showError={!!errors.password}
        />
        <Checkbox
          label="Stay signed in"
          checked={formInput.rememberMe}
          onChange={(val) => handleOnChange("rememberMe", val)}
        />
        <Button className="mt-2" type="submit">
          {loginOptions.isLoading ? <Spinner /> : "Login"}
        </Button>
        <Link variant="secondary" to={clientRoutes.auth.register}>
          Register
        </Link>
        <Link to={clientRoutes.auth.forgotPassword}>Forgot Password</Link>
      </Form>
    </AuthLayout>
  );
}

export { Login };
