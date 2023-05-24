export function formatNumber(
  value: number | null | undefined,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number
): string {
  if (value === undefined || value === null) return "";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits ?? 2,
  });
}


export function isNumeric(str: string): boolean {
  return !isNaN(Number(str));
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
