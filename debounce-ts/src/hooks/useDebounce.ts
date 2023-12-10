/* eslint-disable */

import { useState, useEffect } from "react";

interface UseDebounceReturnTypes<T extends (...args: any[]) => any> {
  debounced: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  cancel: () => void;
}

const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 500,
  immediate: boolean = false
): UseDebounceReturnTypes<T> => {
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [promiseResolve, setPromiseResolve] = useState<
    ((value: ReturnType<T> | null) => void) | null
  >(null);

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise<ReturnType<T>>((res) => {
      const runImmediately = immediate && timeoutId === null;

      if (runImmediately) {
        res(func(...args));
      }

      const delay = () => {
        if (immediate === false) {
          res(func(...args));
        }

        setTimeoutId(null);
      };

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      setPromiseResolve(res as (value: ReturnType<T> | null) => void);

      setTimeoutId(setTimeout(delay, wait));
    });
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);

      if (promiseResolve) {
        setPromiseResolve(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [timeoutId, promiseResolve]);

  return { debounced, cancel };
};

export default useDebounce;
