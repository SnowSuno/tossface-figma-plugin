import React from "react";

interface Props {
  className?: string;
  data: string;
}

export const Svg = React.memo(({ data, ...props }: Props) => (
  <div dangerouslySetInnerHTML={{ __html: data }} {...props} />
));
