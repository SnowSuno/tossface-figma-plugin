const sizeTokens = [4, 8, 12, 16, 20, 24] as const;

export const spacing = {
  ...(Object.fromEntries(sizeTokens.map(value => [value, value])) as {
    [K in (typeof sizeTokens)[number]]: K;
  }),
  md: 10,
  full: "100%",
  icon: 44,
} as const;
