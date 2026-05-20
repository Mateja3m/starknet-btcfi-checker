export function parseTokenAmount(value: string, decimals: number): bigint {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error("Token decimals must be an integer between 0 and 255.");
  }

  const normalized = value.trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid token amount: ${value}`);
  }

  const [wholePart = "0", fractionalPart = ""] = normalized.split(".");
  if (fractionalPart.length > decimals) {
    throw new Error(`Token amount has more precision than ${decimals} decimals.`);
  }

  const scale = 10n ** BigInt(decimals);
  const wholeUnits = BigInt(wholePart) * scale;
  const fractionalUnits =
    fractionalPart.length === 0
      ? 0n
      : BigInt(fractionalPart.padEnd(decimals, "0"));

  return wholeUnits + fractionalUnits;
}

export function compareTokenAmounts(
  left: string,
  right: string,
  decimals: number,
): -1 | 0 | 1 {
  const leftUnits = parseTokenAmount(left, decimals);
  const rightUnits = parseTokenAmount(right, decimals);

  if (leftUnits < rightUnits) {
    return -1;
  }

  if (leftUnits > rightUnits) {
    return 1;
  }

  return 0;
}
