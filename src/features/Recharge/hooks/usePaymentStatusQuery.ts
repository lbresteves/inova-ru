import { usePaymentStatusPolling } from "./usePaymentStatusPolling";

export function usePaymentStatusQuery(
  paymentId: string,
  enabled: boolean,
  pollingStartedAt?: string,
) {
  return usePaymentStatusPolling(paymentId, enabled, pollingStartedAt);
}
