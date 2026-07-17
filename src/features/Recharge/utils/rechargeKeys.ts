export const rechargeKeys = {
  all: ["recharge"] as const,
  balance: () => [...rechargeKeys.all, "balance"] as const,
  payments: () => [...rechargeKeys.all, "payments"] as const,
  payment: (paymentId: string) =>
    [...rechargeKeys.payments(), paymentId] as const,
  paymentStatus: (paymentId: string) =>
    [...rechargeKeys.payment(paymentId), "status"] as const,
};
