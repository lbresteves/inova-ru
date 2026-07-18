import type { PaginatedResponseDto } from "@shared/api";

export type MealHistoryItemDto = {
  data_hora: string;
  filial: {
    codigo: string;
    nome: string;
  };
  quantidade: number;
  valor_total: number;
  gratuidade: boolean;
  tipo_consumidor: string;
};

export type MealHistoryPageDto = PaginatedResponseDto<MealHistoryItemDto>;
