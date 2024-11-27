import { styleVariants } from "@vanilla-extract/css";
import { colors } from "./colors.css";

export const bg = styleVariants(colors, color => ({ backgroundColor: color }));
