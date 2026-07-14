import { httpClient } from "@shared/base";
import type { CreatePaymentResponseDto, PaymentStatusResponseDto } from "../types/PaymentDto";
import { mapCreatedPayment, mapPaymentStatusResponse } from "../utils/paymentMappers";

export const paymentRepository = {
  async createPayment(amount: number) {
    const response = await httpClient.post<CreatePaymentResponseDto>(
      "/creditos/pagamento",
      { valor: amount },
    );
    return mapCreatedPayment(response, amount);
  },

  async getPaymentStatus(paymentId: string) {
    const response = await httpClient.get<PaymentStatusResponseDto>(
      `/creditos/pagamento/${encodeURIComponent(paymentId)}/status`,
    );
    return mapPaymentStatusResponse(response);
  },
};
