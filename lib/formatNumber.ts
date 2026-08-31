/**
 * 旧PHPのnumber_format(val, get_decimal_digits(val))相当。
 * 値が本来持つ小数桁数を保ったまま、桁区切り付きの文字列に整形する。
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  const digits = (String(value).split('.')[1] || '').length;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
