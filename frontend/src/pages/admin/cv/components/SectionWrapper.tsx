import React from "react";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "@waitingonalice/design-system";

interface SectionWrapperProps {
  children: React.ReactNode;
  onClick: () => void;
  buttonLabel: string;
}

function SectionWrapper({
  children,
  onClick,
  buttonLabel,
}: SectionWrapperProps) {
  return (
    <section>
      {children}
      <Button size="small" onClick={onClick}>
        <PlusIcon className="w-4 h-4" />
        {buttonLabel}
      </Button>
    </section>
  );
}

export { SectionWrapper };
