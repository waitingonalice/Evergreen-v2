import React from "react";
import { useDelayUnmount } from "@waitingonalice/design-system/hooks/delay-unmount";

export interface AnimateProps {
  show: boolean;
  timer?: number;
  children: React.ReactNode;
}

function Animate({ children, show, timer = 100 }: AnimateProps) {
  const render = useDelayUnmount(show, timer);
  return <>{render && children}</>;
}

export { Animate };
