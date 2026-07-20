import type { RechargeBalance } from "../types/Recharge";
import { formatCurrency } from "./currency";

const MIN_RECHARGE_AMOUNT = 5;
const CONTRACT_MAX_RECHARGE_AMOUNT = 500;

export function validateRechargeAmount(
  amount: number,
  balance?: RechargeBalance,
): string | undefined {
  if (!Number.isFinite(amount)) {
    return "Informe um valor de recarga válido.";
  }

  if (amount < MIN_RECHARGE_AMOUNT) {
    return "O valor mínimo para recarga é R$ 5,00.";
  }

  const maximum = Math.min(
    CONTRACT_MAX_RECHARGE_AMOUNT,
    balance?.maxRechargeAmount ?? CONTRACT_MAX_RECHARGE_AMOUNT,
  );

  if (amount > maximum) {
    return `O valor máximo por recarga é ${formatCurrency(maximum)}.`;
  }

  return undefined;
}
