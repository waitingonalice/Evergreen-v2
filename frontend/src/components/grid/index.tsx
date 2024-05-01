import React from "react";
import { Text, cn } from "@waitingonalice/design-system";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}
function Grid({ title, children, className }: GridProps) {
  return (
    <div className="w-full max-w-screen-2xl">
      <Text className="text-secondary-1 mb-4" type="subhead-1-bold">
        {title}
      </Text>
      <div
        className={cn(
          "md:p-8",
          "p-4 bg-secondary-1 w-full rounded-lg",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Grid };
