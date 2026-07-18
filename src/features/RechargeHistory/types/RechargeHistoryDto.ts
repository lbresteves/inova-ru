import type { PaginatedResponseDto } from "@shared/api";

export type RechargeHistoryItemDto = {
  id: number;
  valor: number;
  metodo: string;
  status: string;
  data_hora: string;
};

export type RechargeHistoryPageDto = PaginatedResponseDto<RechargeHistoryItemDto>;
