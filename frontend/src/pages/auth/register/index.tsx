import React, { useState } from "react";
import {
  Button,
  Form,
  FormInput,
  FormNativeSelect, // cn,
  Link,
} from "@waitingonalice/design-system";
import { AuthLayout } from "@/components";
import { CountryEnum, clientRoutes } from "@/constants";
import { generateOptions } from "@/utils";

function Register() {
  const [formInput, setFormInput] = useState({
    username: "",
    password: "",
    email: "",
    country: "",
    secret: "",
  });

  const handleOnChange = (key: string, value: string) => {
    setFormInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const countryOptions = generateOptions(CountryEnum);

  return (
    <AuthLayout title="Sign Up">
      <Form className="flex flex-col gap-y-4">
        <FormInput
          id="email"
          label="Email Address"
          value={formInput.email}
          required
          onChange={(val) => handleOnChange("email", val)}
          autoComplete="email"
        />
        <FormInput
          label="Username"
          value={formInput.username}
          onChange={(val) => handleOnChange("username", val)}
          required
        />
        <FormInput
          id="password"
          label="Password"
          value={formInput.password}
          onChange={(val) => handleOnChange("password", val)}
          isPassword
          required
          autoComplete="current-password"
        />
        <FormNativeSelect
          label="Country"
          required
          value={formInput.country}
          options={countryOptions}
          placeholder="Select a country"
          onChange={(val) => handleOnChange("country", val)}
        />
        <FormInput
          label="What was the name of your first pet?"
          required
          value={formInput.secret}
          onChange={(val) => handleOnChange("secret", val)}
        />
        <Button className="mt-4" type="submit">
          Sign up
        </Button>
        <Link to={clientRoutes.auth.admin.login}>Back to login page</Link>
      </Form>
    </AuthLayout>
  );
}

export default Register;
