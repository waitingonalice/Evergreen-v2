import { useEffect } from "react";

interface UsePollOptions {
  interval?: number;
}

let timer: NodeJS.Timeout | null = null;
export const usePoll = ({
  interval = 3000,
}: UsePollOptions | undefined = {}) => {
  const start = (callback: () => void) => {
    timer = setInterval(() => {
      callback();
    }, interval);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  useEffect(
    () => () => {
      stop();
    },
    [],
  );

  return {
    start,
    stop,
  };
};
