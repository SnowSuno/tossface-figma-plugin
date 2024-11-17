import React from "react";

interface Props {
  data: string;
}

export const Svg = React.memo(({ data, ...props }: Props) => (
  <div dangerouslySetInnerHTML={{ __html: data }} {...props} />
));
