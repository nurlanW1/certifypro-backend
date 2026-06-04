export function somToTiyin(amountSom: number): number {
  return Math.round(Number(amountSom) * 100)
}

export function paymeAmountsMatch(orderAmountSom: number, paymeAmountTiyin: number): boolean {
  return somToTiyin(orderAmountSom) === Math.round(Number(paymeAmountTiyin))
}
