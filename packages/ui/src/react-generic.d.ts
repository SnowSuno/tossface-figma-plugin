/**
 * Type augumentations for react's HoC functions(memo, forwardRef, etc)
 * to preserve typings of generic components.
 */
import "react";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: ForwardedRef<T>) => ReactElement | null,
  ): (props: P & RefAttributes<T>) => ReactElement | null;

  function memo<T>(component: T): T;
}
