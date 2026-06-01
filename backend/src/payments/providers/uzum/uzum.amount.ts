/** Order amounts in DB are UZS (som); Uzum API uses tiyin. */
export function somToTiyin(amountSom: number): number {
  return Math.round(Number(amountSom) * 100);
}

export function tiyinToSom(amountTiyin: number): number {
  return Number(amountTiyin) / 100;
}

export function uzumAmountsMatch(orderAmountSom: number, uzumAmountTiyin: number): boolean {
  return somToTiyin(orderAmountSom) === Math.round(Number(uzumAmountTiyin));
}
