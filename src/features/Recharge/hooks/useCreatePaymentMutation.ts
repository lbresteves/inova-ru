import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rechargeRepository } from "../services/rechargeServices";
import { rechargeKeys } from "../utils/rechargeKeys";

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => rechargeRepository.createPayment(amount),
    onSuccess: (payment) => {
      queryClient.removeQueries({
        exact: true,
        queryKey: rechargeKeys.paymentStatus(payment.id),
      });
      queryClient.setQueryData(rechargeKeys.payment(payment.id), payment);
    },
  });
}
