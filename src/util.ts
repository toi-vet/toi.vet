export function formatNumber(
  value?: number,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number
): string {
  if (!value) return "";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits ?? 2,
  });
}

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str));
}
