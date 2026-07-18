import type { IHttpClient } from "@shared/types/IHttpClient";
import type { MealHistoryFilters, MealHistoryPage } from "../types/MealHistory";
import type { MealHistoryPageDto } from "../types/MealHistoryDto";
import { mapMealHistoryPage } from "../utils/mapMealHistory";

export type MealHistoryQuery = {
  filters: MealHistoryFilters;
  page: number;
  perPage?: number;
  signal?: AbortSignal;
};

export class MealHistoryRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async getPage({
    filters,
    page,
    perPage = 20,
    signal,
  }: MealHistoryQuery): Promise<MealHistoryPage> {
    const response = await this.httpClient.get<MealHistoryPageDto>(
      "/creditos/refeicoes",
      {
        params: {
          dataFim: filters.dataFim,
          dataInicio: filters.dataInicio,
          filial: filters.filial || undefined,
          page,
          perPage,
        },
        signal,
      },
    );

    return mapMealHistoryPage(response);
  }
}
