import { mapCreditAccount } from "@features/CreditAccount";
import type { RechargeBalanceResponseDto } from "../types/RechargeBalanceDto";
import type { RechargeBalance } from "../types/Recharge";

export function mapRechargeBalance(
  dto: RechargeBalanceResponseDto,
): RechargeBalance {
  return mapCreditAccount(dto).balance;
}
