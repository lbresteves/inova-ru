export function onlyCurrencyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function formatCurrencyInput(digits: string) {
  if (!digits) return "";
  const cents = Number(digits);
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function currencyInputToNumber(value: string) {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Number(normalized || 0);
}
