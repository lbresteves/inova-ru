import type { MealHistoryFilters } from "../types/MealHistory";

export const mealHistoryKeys = {
  all: ["meal-history"] as const,
  list: (
    cpf: string | null | undefined,
    filters: MealHistoryFilters,
    perPage: number,
  ) =>
    [
      ...mealHistoryKeys.all,
      cpf ?? "anonymous",
      {
        dataFim: filters.dataFim ?? null,
        dataInicio: filters.dataInicio ?? null,
        filial: filters.filial ?? null,
        perPage,
      },
    ] as const,
};
