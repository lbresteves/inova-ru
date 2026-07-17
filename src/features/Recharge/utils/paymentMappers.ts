import type {
  CreatePaymentResponseDto,
  PaymentStatusResponseDto,
} from "../types/PaymentDto";
import type {
  CreatedPayment,
  PaymentStatus,
  PaymentStatusResult,
} from "../types/Recharge";

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

function createQrCodeUri(base64?: string): string | null {
  const value = base64?.trim();

  if (!value) {
    return null;
  }

  return value.startsWith("data:image/")
    ? value
    : `data:image/png;base64,${value}`;
}

function resolveExpiration(expiration?: string): string {
  const parsedExpiration = expiration ? new Date(expiration) : null;

  if (parsedExpiration && !Number.isNaN(parsedExpiration.getTime())) {
    return parsedExpiration.toISOString();
  }

  return new Date(Date.now() + 5 * 60 * 1000).toISOString();
}

export function mapCreatedPayment(
  dto: CreatePaymentResponseDto,
  amount: number,
): CreatedPayment {
  return {
    amount,
    balanceCredited: false,
    copyPasteCode: dto.qr_code,
    expiresAt: resolveExpiration(dto.expiration),
    id: String(dto.payment_id),
    qrCodeUri: createQrCodeUri(dto.qr_code_base64),
    status: mapPaymentStatus(dto.status),
    ticketUrl: dto.ticket_url?.trim() || null,
  };
}

export function mapPaymentStatusResponse(
  dto: PaymentStatusResponseDto,
): PaymentStatusResult {
  return {
    credited: dto.creditado === true,
    id: String(dto.payment_id),
    status: mapPaymentStatus(dto.status),
    statusDetail: dto.status_detail?.trim() || null,
  };
}
