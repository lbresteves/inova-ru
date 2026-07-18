import {
  assertRecord,
  createContractError,
  readBoolean,
  readDateString,
  readOptionalString,
  readString,
} from "@shared/api";
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
    case "pending":
      return "pending";
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "expired":
      return "expired";
    default:
      throw createContractError("Status de pagamento desconhecido.", value);
  }
}

function readPaymentId(record: Record<string, unknown>): string {
  const value = record.payment_id;
  if ((typeof value === "string" && value.trim()) || typeof value === "number") {
    return String(value);
  }

  throw createContractError("ID do pagamento inválido.", record);
}

function createQrCodeUri(base64: string): string {
  const value = base64.trim();

  if (!value) {
    throw createContractError("QR Code base64 ausente.", base64);
  }

  return value.startsWith("data:image/")
    ? value
    : `data:image/png;base64,${value}`;
}

export function mapCreatedPayment(
  dto: CreatePaymentResponseDto,
  amount: number,
): CreatedPayment {
  const root = assertRecord(dto, "payment");

  return {
    amount,
    copyPasteCode: readString(root, "qr_code"),
    expiresAt: readDateString(root, "expiration"),
    id: readPaymentId(root),
    qrCodeUri: createQrCodeUri(readString(root, "qr_code_base64")),
    status: mapPaymentStatus(readString(root, "status")),
    ticketUrl: readString(root, "ticket_url"),
  };
}

export function mapPaymentStatusResponse(
  dto: PaymentStatusResponseDto,
): PaymentStatusResult {
  const root = assertRecord(dto, "paymentStatus");
  const statusDetail = readOptionalString(root, "status_detail");

  return {
    credited: readBoolean(root, "creditado", false),
    id: readPaymentId(root),
    status: mapPaymentStatus(readString(root, "status")),
    statusDetail: statusDetail?.trim() || null,
  };
}
