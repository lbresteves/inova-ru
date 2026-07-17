import type { IHttpClient } from "@shared/types/IHttpClient";
import type {
  CreatePaymentRequestDto,
  CreatePaymentResponseDto,
  PaymentStatusResponseDto,
} from "../types/PaymentDto";
import type { RechargeBalanceResponseDto } from "../types/RechargeBalanceDto";
import type {
  CreatedPayment,
  PaymentStatusResult,
  RechargeBalance,
} from "../types/Recharge";
import { mapRechargeBalance } from "../utils/mapRechargeBalance";
import {
  mapCreatedPayment,
  mapPaymentStatusResponse,
} from "../utils/paymentMappers";

export class RechargeRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async getBalance(signal?: AbortSignal): Promise<RechargeBalance> {
    const response = await this.httpClient.get<RechargeBalanceResponseDto>(
      "/creditos/saldo",
      { signal },
    );

    return mapRechargeBalance(response);
  }

  async createPayment(amount: number): Promise<CreatedPayment> {
    const response = await this.httpClient.post<
      CreatePaymentRequestDto,
      CreatePaymentResponseDto
    >("/creditos/pagamento", { valor: amount });

    return mapCreatedPayment(response, amount);
  }

  async getPaymentStatus(
    paymentId: string,
    signal?: AbortSignal,
  ): Promise<PaymentStatusResult> {
    const response = await this.httpClient.get<PaymentStatusResponseDto>(
      `/creditos/pagamento/${encodeURIComponent(paymentId)}/status`,
      { signal },
    );

    return mapPaymentStatusResponse(response);
  }
}
