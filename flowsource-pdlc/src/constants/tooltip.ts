export const TOOLTIPS = {
  chatOptions: "Sample Questions",
} as const;
export const allowedTooltips = Object.keys(
  TOOLTIPS
) as unknown as keyof typeof TOOLTIPS;
