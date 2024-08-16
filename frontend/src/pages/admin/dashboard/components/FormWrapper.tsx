import React from "react";
import { Text } from "@waitingonalice/design-system/components/text";

interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
}
function FormWrapper({ children, title }: FormWrapperProps) {
  return (
    <div className="flex flex-col gap-4 w-full border rounded-md p-4">
      <Text type="subhead-2-bold">{title}</Text>
      {children}
    </div>
  );
}

export default FormWrapper;
