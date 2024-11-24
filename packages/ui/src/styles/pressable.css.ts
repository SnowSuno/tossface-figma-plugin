import { style } from "@vanilla-extract/css";

export const pressable = style({
  ":hover": {
    backgroundColor: "var(--grey200)",
  },
  ":active": {
    scale: 0.9,
    backgroundColor: "var(--grey300)",
  },
  "transition": "scale .1s ease, background .2s ease",
});
