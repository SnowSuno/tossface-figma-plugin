import { css } from "@emotion/react";

export const pressable = css({
  ":hover": {
    backgroundColor: "var(--grey200)",
  },
  ":active": {
    scale: 0.9,
    backgroundColor: "var(--grey300)",
  },
  "transition": "scale .1s ease, background .2s ease",
});
