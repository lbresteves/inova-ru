export type RechargeHistoryResponseDto = {
  data: {
    data_hora: string;
    filial: {
      codigo: string;
      nome: string;
    };
    quantidade: number;
    valor_total: number;
    gratuidade: boolean;
    tipo_consumidor: string;
  }[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
  };
};
