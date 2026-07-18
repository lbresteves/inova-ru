import { useSessionStore } from "@features/Auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activePaymentStorage } from "../services/ActivePaymentStorage";
import { rechargeRepository } from "../services/rechargeServices";
import { rechargeKeys } from "../utils/rechargeKeys";

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();
  const session = useSessionStore((state) => state.session);

  return useMutation({
    mutationFn: (amount: number) => rechargeRepository.createPayment(amount),
    onSuccess: async (payment) => {
      queryClient.removeQueries({
        exact: true,
        queryKey: rechargeKeys.paymentStatus(payment.id),
      });
      queryClient.setQueryData(rechargeKeys.payment(payment.id), payment);

      if (session?.subjectCpf) {
        await activePaymentStorage.set(payment, session.subjectCpf);
      }
    },
  });
}
