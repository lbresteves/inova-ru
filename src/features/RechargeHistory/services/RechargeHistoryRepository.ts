import type { IHttpClient } from "@shared/types/IHttpClient";
import type {
  RechargeHistoryFilters,
  RechargeHistoryPage,
} from "../types/RechargeHistory";
import type { RechargeHistoryPageDto } from "../types/RechargeHistoryDto";
import { mapRechargeHistoryPage } from "../utils/mapRechargeHistory";

export type RechargeHistoryQuery = {
  filters: RechargeHistoryFilters;
  page: number;
  perPage?: number;
  signal?: AbortSignal;
};

export class RechargeHistoryRepository {
  constructor(private readonly httpClient: IHttpClient) {}

  async getPage({
    filters,
    page,
    perPage = 20,
    signal,
  }: RechargeHistoryQuery): Promise<RechargeHistoryPage> {
    const response = await this.httpClient.get<RechargeHistoryPageDto>(
      "/creditos/recargas",
      {
        params: {
          dataFim: filters.dataFim,
          dataInicio: filters.dataInicio,
          page,
          perPage,
        },
        signal,
      },
    );

    return mapRechargeHistoryPage(response);
  }
}
