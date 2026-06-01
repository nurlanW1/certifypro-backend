/** Order amounts are stored in UZS (som); Payme API uses tiyin (1 som = 100 tiyin). */
export function somToTiyin(amountSom: number): number {
  return Math.round(Number(amountSom) * 100);
}

export function tiyinToSom(amountTiyin: number): number {
  return Number(amountTiyin) / 100;
}

export function paymeAmountsMatch(orderAmountSom: number, paymeAmountTiyin: number): boolean {
  return somToTiyin(orderAmountSom) === Math.round(Number(paymeAmountTiyin));
}
