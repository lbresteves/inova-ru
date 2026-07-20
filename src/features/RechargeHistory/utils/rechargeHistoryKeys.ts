import type { RechargeHistoryFilters } from "../types/RechargeHistory";

export const rechargeHistoryKeys = {
  all: ["recharge-history"] as const,
  list: (
    cpf: string | null | undefined,
    filters: RechargeHistoryFilters,
    perPage: number,
  ) =>
    [
      ...rechargeHistoryKeys.all,
      cpf ?? "anonymous",
      {
        dataFim: filters.dataFim ?? null,
        dataInicio: filters.dataInicio ?? null,
        perPage,
      },
    ] as const,
};
