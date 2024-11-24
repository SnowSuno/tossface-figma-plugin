import { style, styleVariants } from "@vanilla-extract/css";

const baseStyle = style({ display: "flex" });

export const flex = styleVariants(
  { x: "row", y: "column" } as const,
  flexDirection => [baseStyle, { flexDirection }],
);

const positions = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
} as const;

export const align = styleVariants(positions, position => ({
  alignItems: position,
}));

export const justify = styleVariants(
  { ...positions, stretch: "stretch" },
  position => ({
    justifyContent: position,
  }),
);
