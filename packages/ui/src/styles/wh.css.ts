import { styleVariants } from "@vanilla-extract/css";
import { spacing } from "./spacing.css";

export const w = styleVariants(spacing, width => ({ width }));
export const h = styleVariants(spacing, height => ({ height }));
export const wh = styleVariants(spacing, value => ({
  width: value,
  height: value,
}));
