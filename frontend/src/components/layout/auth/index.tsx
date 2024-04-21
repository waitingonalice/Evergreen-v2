import React from "react";
import { Text, cn } from "@waitingonalice/design-system";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}
export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col p-8">
      <div
        className={cn(
          "md:w-1/2",
          "w-full border p-4 rounded-lg shadow-sm shadow-primary-light bg-white",
        )}
      >
        {title && (
          <Text className="mb-4" type="subhead-1-bold">
            {title}
          </Text>
        )}
        {children}
      </div>
    </div>
  );
}
