export function formatPrice(value?: number): string {
  if (!value) return "";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function isNumeric(str: string): boolean {
  return !isNaN(Number(str));
}
