import type { RechargeBalance } from "../types/Recharge";
import { formatCurrency } from "./currency";

export function validateRechargeAmount(
  amount: number,
  balance?: RechargeBalance,
): string | undefined {
  if (amount < 5) {
    return "O valor mínimo para recarga é R$ 5,00.";
  }

  if (amount > 500) {
    return "O valor máximo para recarga é R$ 500,00.";
  }

  if (balance && balance.current + amount > balance.limit) {
    return `O saldo após a recarga não pode ultrapassar ${formatCurrency(balance.limit)}.`;
  }

  return undefined;
}
