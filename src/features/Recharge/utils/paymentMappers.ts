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
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return String(value);
  }
  if (typeof value === "string" && /^\d+$/.test(value) && Number(value) > 0) {
    return value;
  }

  throw createContractError("ID do pagamento inválido.", record);
}

function createQrCodeUri(base64: string): string {
  const value = base64.trim();
  if (!value) {
    throw createContractError("QR Code base64 ausente.", base64);
  }

  if (value.startsWith("data:image/")) {
    return value;
  }

  if (!/^[A-Za-z0-9+/=\s]+$/.test(value)) {
    throw createContractError("QR Code base64 inválido.", base64);
  }

  return `data:image/png;base64,${value.replace(/\s/g, "")}`;
}

function readTicketUrl(record: Record<string, unknown>): string {
  const value = readString(record, "ticket_url");
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return value;
    }
  } catch {
    // Converted to a contract error below.
  }

  throw createContractError("URL do ticket de pagamento inválida.", value);
}

export function mapCreatedPayment(
  dto: CreatePaymentResponseDto,
  amount: number,
): CreatedPayment {
  const root = assertRecord(dto, "payment");
  const status = mapPaymentStatus(readString(root, "status"));
  if (status !== "pending") {
    throw createContractError(
      "O pagamento criado deve iniciar com status pending.",
      root,
    );
  }

  return {
    amount,
    copyPasteCode: readString(root, "qr_code"),
    expiresAt: readDateString(root, "expiration"),
    id: readPaymentId(root),
    qrCodeUri: createQrCodeUri(readString(root, "qr_code_base64")),
    status,
    ticketUrl: readTicketUrl(root),
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
