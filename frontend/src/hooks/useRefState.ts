import { useRef } from "react";

/**
  @description This hook works similarly to useState, but it uses a ref to store the state value. This is useful when you want to update the state without causing a re-render. It is also useful when you want to access the previous state value.
 * */
export function useRefState<T = undefined>(value?: T) {
  const prevRef = useRef<T>(value as T);

  const setRef = (val: T | ((prev: T) => T)) => {
    const nextValue: T = val instanceof Function ? val(prevRef.current) : val;
    if (nextValue !== prevRef.current) {
      prevRef.current = nextValue;
    }
  };

  return [prevRef.current, setRef] as const;
}
