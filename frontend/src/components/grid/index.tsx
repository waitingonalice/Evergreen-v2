import React from "react";
import { Text, cn } from "@waitingonalice/design-system";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  callToAction?: React.ReactNode;
}
function Grid({ title, children, className, callToAction }: GridProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Text className="text-secondary-1" type="subhead-1-bold">
          {title}
        </Text>
        {callToAction}
      </div>
      <div className={cn("p-4 bg-secondary-1 w-full rounded-lg", className)}>
        {children}
      </div>
    </div>
  );
}

export { Grid };
