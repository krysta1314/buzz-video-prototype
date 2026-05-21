export function fmtNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtMoney(n: number): string {
  const isInt = Number.isInteger(n);
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
