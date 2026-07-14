import { useQuery } from "@tanstack/react-query";
import { paymentRepository } from "../services/PaymentRepository";
import { paymentKeys } from "./paymentKeys";

export function usePaymentStatusQuery(paymentId: string) {
  return useQuery({
    enabled: Boolean(paymentId),
    queryFn: () => paymentRepository.getPaymentStatus(paymentId),
    queryKey: paymentKeys.status(paymentId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || status === "pending" ? 2_000 : false;
    },
    retry: 1,
  });
}
