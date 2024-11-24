import { bg, wh } from "@/styles";
import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
  data: string;
}

export const Svg = React.memo(({ data, ...props }: Props) => (
  <div dangerouslySetInnerHTML={{ __html: data }} {...props} />
  // <img src={`data:image/svg+xml;utf8,${encodeURIComponent(data)}`} />
  // <div className={clsx(wh.full, bg.grey200)} />
));
