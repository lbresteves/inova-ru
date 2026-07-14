import type { CreatePaymentResponseDto, PaymentStatusResponseDto } from "../types/PaymentDto";
import type { CreatedPayment, PaymentStatus, PaymentStatusResult } from "../types/Recharge";

export function mapPaymentStatus(value: string): PaymentStatus {
  switch (value.trim().toLocaleLowerCase("en-US")) {
    case "approved":
    case "paid":
    case "success":
      return "approved";
    case "rejected":
    case "failed":
      return "rejected";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "expired":
      return "expired";
    default:
      return "pending";
  }
}

export function createQrCodeUri(base64?: string): string | null {
  if (!base64?.trim()) return null;
  return base64.startsWith("data:image/")
    ? base64
    : `data:image/png;base64,${base64}`;
}

export function mapCreatedPayment(
  dto: CreatePaymentResponseDto,
  amount: number,
): CreatedPayment {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000);

  return {
    amount,
    copyPasteCode: dto.qr_code,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    id: String(dto.payment_id),
    qrCodeUri: createQrCodeUri(dto.qr_code_base64),
    status: mapPaymentStatus(dto.status),
  };
}

export function mapPaymentStatusResponse(
  dto: PaymentStatusResponseDto,
): PaymentStatusResult {
  return {
    credited: dto.creditado === true,
    id: String(dto.payment_id),
    status: mapPaymentStatus(dto.status),
  };
}
