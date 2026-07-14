export type CreatePaymentResponseDto = {
  payment_id: string | number;
  status: string;
  qr_code: string;
  qr_code_base64?: string;
};

export type PaymentStatusResponseDto = {
  payment_id: string | number;
  status: string;
  status_detail?: string;
  creditado?: boolean;
};
