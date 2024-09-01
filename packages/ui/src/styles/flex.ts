import { css } from "@emotion/react";
import { Property } from "csstype";

interface FlexProps {
  direction: "x" | "y";
  align?: Property.AlignItems;
  justify?: Property.JustifyContent;
  gap?: number;
}

export const flex = (props: FlexProps) =>
  css({
    display: "flex",
    flexDirection: props.direction === "x" ? "row" : "column",
    justifyContent: props.justify,
    alignItems: props.align,
    gap: props.gap,
  });
