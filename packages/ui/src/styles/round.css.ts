import { styleVariants } from "@vanilla-extract/css";
import { spacing } from "./spacing.css";

export const round = styleVariants(spacing, value => ({
  borderRadius: value,
}));
