/** Format order amount for Click pay link (som, 2 decimal places). */
export function formatClickAmount(amount: number): string {
  return Number(amount).toFixed(2);
}

/** Compare Click callback amount with stored order amount (som). */
export function clickAmountsMatch(orderAmount: number, clickAmount: number): boolean {
  const expected = Math.round(Number(orderAmount) * 100);
  const received = Math.round(Number(clickAmount) * 100);
  return expected === received && expected > 0;
}
