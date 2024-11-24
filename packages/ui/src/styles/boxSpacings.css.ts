import { styleVariants } from "@vanilla-extract/css";
import { spacing } from "./spacing.css";

const sizeVariants = (attribute: string) =>
  styleVariants(spacing, value => ({ [attribute]: value }));

const spacingFactory = (prefix: "padding" | "margin") => ({
  ...sizeVariants(prefix),
  top: sizeVariants(`${prefix}Top`),
  bottom: sizeVariants(`${prefix}Bottom`),
  left: sizeVariants(`${prefix}Left`),
  right: sizeVariants(`${prefix}Right`),
  x: sizeVariants(`${prefix}Inline`),
  y: sizeVariants(`${prefix}Block`),
});

export const padding = spacingFactory("padding");
export const margin = spacingFactory("margin");
