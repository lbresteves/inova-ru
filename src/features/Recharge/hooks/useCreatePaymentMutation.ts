import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentRepository } from "../services/PaymentRepository";
import { paymentKeys } from "./paymentKeys";

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => paymentRepository.createPayment(amount),
    onSuccess: (payment) => {
      queryClient.setQueryData(paymentKeys.detail(payment.id), payment);
    },
  });
}
