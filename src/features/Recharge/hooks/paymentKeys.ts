export const paymentKeys = {
  all: ["payments"] as const,
  detail: (paymentId: string) => ["payments", "detail", paymentId] as const,
  status: (paymentId: string) => ["payments", "status", paymentId] as const,
};
