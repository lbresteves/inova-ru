import { httpClient } from "@shared/base";
import type { BalanceDto } from "../types/BalanceDto";
import { mapBalanceDto } from "../utils/mapBalanceDto";

export const homeRepository = {
  async getSummary() {
    const response = await httpClient.get<BalanceDto>("/creditos/saldo");
    return mapBalanceDto(response);
  },
};
