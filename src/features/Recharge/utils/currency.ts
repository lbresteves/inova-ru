export function onlyCurrencyDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 5);
}

export function formatCurrencyInput(digits: string): string {
  if (!digits) {
    return "";
  }

  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function currencyInputToNumber(value: string): number {
  return Number(value.replace(/\./g, "").replace(",", ".") || 0);
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
