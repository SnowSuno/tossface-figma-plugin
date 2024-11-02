import { debounce } from "es-toolkit";
import { useCallback, useEffect, useRef, useState } from "react";

interface Options<T> {
  timeout: number;
  resetOn?: (value: T) => boolean;
}

export function useDebounce<T>(
  value: T,
  { timeout, resetOn = () => false }: Options<T>,
) {
  const [debouncedValue, setValue] = useState<T>(value);
  const setValueDebounced = useRef(debounce(setValue, timeout)).current;

  const reset = useCallback(() => {
    setValueDebounced.cancel();
    setValue(value);
  }, [value, setValue, setValueDebounced]);

  useEffect(() => {
    resetOn(value) ? reset() : setValueDebounced(value);
  }, [value, setValueDebounced]);

  return [debouncedValue, reset] as const;
}
