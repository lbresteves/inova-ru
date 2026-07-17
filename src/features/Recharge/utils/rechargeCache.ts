import type { QueryClient } from "@tanstack/react-query";

import { rechargeKeys } from "./rechargeKeys";
import type { CreatedPayment, RechargeBalance } from "../types/Recharge";

export function creditPaymentBalance(
  queryClient: QueryClient,
  paymentId: string,
): boolean {
  const payment = queryClient.getQueryData<CreatedPayment>(
    rechargeKeys.payment(paymentId),
  );

  if (!payment || payment.balanceCredited) {
    return false;
  }

  const balance = queryClient.getQueryData<RechargeBalance>(
    rechargeKeys.balance(),
  );

  if (!balance) {
    return false;
  }

  queryClient.setQueryData<RechargeBalance>(rechargeKeys.balance(), {
    ...balance,
    current: balance.current + payment.amount,
  });

  queryClient.setQueryData<CreatedPayment>(rechargeKeys.payment(paymentId), {
    ...payment,
    balanceCredited: true,
    status: "approved",
  });

  return true;
}
