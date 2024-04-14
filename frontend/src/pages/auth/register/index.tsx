/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable no-console */
import React, { useState } from "react";
import {
  Button,
  Form,
  FormInput,
  FormNativeSelect, // cn,
  Link,
  useForm,
} from "@waitingonalice/design-system";
import { AuthLayout } from "@/components";
import { CountryEnum, clientRoutes } from "@/constants";
import { generateOptions } from "@/utils";
import { RegisterNewUserType, useRegister } from "./loaders/register";
import { registerSchema } from "./utils/validation";

function Register() {
  const [formInput, setFormInput] = useState<RegisterNewUserType>({
    username: "",
    password: "",
    email: "",
    country: "",
    secret: "",
  });
  const { validate, onSubmit, errors } = useForm({
    zod: registerSchema,
    data: formInput,
  });
  const [registerUser, registerOptions] = useRegister();

  const handleOnChange = (key: string, value: string) => {
    setFormInput((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    const success = onSubmit();
    if (!success) return;
    try {
      await registerUser(formInput);
    } catch (e) {
      console.log(e);
    }
  };

  const countryOptions = generateOptions(CountryEnum);

  return (
    <AuthLayout title="Sign Up">
      <Form onSubmit={handleRegister} className="flex flex-col gap-y-4">
        <FormInput
          id="email"
          label="Email Address"
          value={formInput.email}
          required
          onChange={(val) => handleOnChange("email", val)}
          autoComplete="email"
          showError={Boolean(errors.email)}
          errorMessage={errors.email}
        />
        <FormInput
          label="Username"
          value={formInput.username}
          onChange={(val) => handleOnChange("username", val)}
          required
          showError={Boolean(errors.username)}
          errorMessage={errors.username}
        />
        <FormInput
          id="password"
          label="Password"
          value={formInput.password}
          onChange={(val) => handleOnChange("password", val)}
          isPassword
          required
          autoComplete="current-password"
          showError={Boolean(errors.password)}
          errorMessage={errors.password}
        />
        <FormNativeSelect
          label="Country"
          required
          value={formInput.country}
          options={countryOptions}
          placeholder="Select a country"
          onChange={(val) => handleOnChange("country", val)}
          showError={Boolean(errors.country)}
          errorMessage={errors.country}
        />
        <FormInput
          label="What was the name of your first pet?"
          required
          value={formInput.secret}
          onChange={(val) => handleOnChange("secret", val)}
          showError={Boolean(errors.secret)}
          errorMessage={errors.secret}
        />
        <Button className="mt-4" type="submit">
          Sign up
        </Button>
        <Link
          className="w-fit ml-auto mr-auto"
          to={clientRoutes.auth.admin.login}
        >
          Back to login page
        </Link>
      </Form>
    </AuthLayout>
  );
}

export default Register;
