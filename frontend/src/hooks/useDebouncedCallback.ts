/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { debounce } from "lodash";

const DEFAULT_CALLBACK_DELAY = 500;

export const useDebouncedCallback = <T>(
  callback: (args: T) => void,
  delay?: number,
) => useCallback(debounce(callback, delay ?? DEFAULT_CALLBACK_DELAY), []);
