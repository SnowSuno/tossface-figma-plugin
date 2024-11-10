import { useEffect, useMemo } from "react";
import { debounce } from "es-toolkit";
import { usePreservedCallback } from "./usePresevedCallback";

interface DebounceOptions {
  signal?: AbortSignal;
  /**
   * @default ["trailing"]
   */
  edges?: Array<"leading" | "trailing">;
}

/**
 * @name useDebounce
 * @description
 * `lodash.debounce` 를 쉽게 사용할 수 있는 hook 입니다.
 *
 * @reference https://lodash.com/docs/4.17.15#debounce
 * @param options.leading timeout의 시작 부분에서 호출할지 여부를 지정 (default: false)
 * e.g.) wait이 200ms이면, 함수를 호출하고 200ms 동안 다시 호출하지 않습니다.
 * @param options.maxWait 함수가 호출되기 전까지 지연시킬 수 있는 최대 시간
 * @param options.trailing timeout의 끝 부분에서 호출할지 여부를 지정 (default: true)
 * e.g.) wait이 200ms이면, 200ms 동안 함수를 호출하지 않고 마지막에 한번만 호출합니다.
 * leading과 trailing이 모두 true -> wait timeout 동안 debounced 함수가 두 번 이상 호출되면 timeout의 끝 부분에서만 func이 호출됩니다.
 *
 * @example
 * import { useDebounce } from '@tossteam/react';
 *
 * // 이 함수는 500ms 기준으로 debounce 됩니다.
 * const handleClick = useDebounce(() => {
 *   getV2Logger().log(schemaId, parameter);
 * }, 500);
 */
export function useDebounce<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options: DebounceOptions = {},
) {
  const preservedCallback = usePreservedCallback(callback);

  const debounced = useMemo(() => {
    return debounce(preservedCallback, wait, options);
  }, [preservedCallback, wait, options]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
