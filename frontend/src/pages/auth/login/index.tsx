/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, FormInput, Link } from "@waitingonalice/design-system";
import { AuthLayout } from "@/components";
import { clientRoutes } from "@/constants";

function Login() {
  const router = useRouter();
  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
  });

  const handleOnChange = (key: string, value: string) => {
    setFormInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AuthLayout title="Login">
      <Form className="flex flex-col gap-y-4">
        <FormInput
          id="username"
          label="Username"
          value={formInput.username}
          onChange={(val) => handleOnChange("username", val)}
          autoComplete="username"
        />
        <FormInput
          id="password"
          label="Password"
          value={formInput.password}
          onChange={(val) => handleOnChange("password", val)}
          isPassword
          autoComplete="current-password"
        />

        <Button className="mt-4" type="submit">
          Sign in
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
