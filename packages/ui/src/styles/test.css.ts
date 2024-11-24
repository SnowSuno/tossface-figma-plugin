import { keyframes, style } from "@vanilla-extract/css";

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const fade = style({
  animation: `${fadeIn} .1s`,
});
