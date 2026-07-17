import { useQuery } from "@tanstack/react-query";

import { rechargeRepository } from "../services/rechargeServices";
import { rechargeKeys } from "./rechargeKeys";

export function usePaymentStatusQuery(
  paymentId: string,
  enabled: boolean,
) {
  return useQuery({
    enabled: enabled && Boolean(paymentId),
    queryKey: rechargeKeys.paymentStatus(paymentId),
    queryFn: ({ signal }) =>
      rechargeRepository.getPaymentStatus(paymentId, signal),
    refetchInterval: (query) => {
      const result = query.state.data;
      return !result ||
        result.status === "pending" ||
        (result.status === "approved" && !result.credited)
        ? 2_000
        : false;
    },
    retry: 1,
  });
}
