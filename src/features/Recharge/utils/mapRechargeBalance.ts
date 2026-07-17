import type { RechargeBalanceResponseDto } from "../types/RechargeBalanceDto";
import type { RechargeBalance } from "../types/Recharge";

export function mapRechargeBalance(
  dto: RechargeBalanceResponseDto,
): RechargeBalance {
  return {
    current: Number(dto.saldo.credito_disponivel),
    limit: Number(dto.saldo.limite_recarga),
  };
}
