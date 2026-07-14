import { httpClient } from "@shared/base";
import type { RechargeHistoryResponseDto } from "../types/RechargeHistoryDto";
import { mapRechargeHistory } from "../utils/mapRechargeHistory";

export const rechargeHistoryRepository = {
  async getHistory() {
    const response = await httpClient.get<RechargeHistoryResponseDto>(
      "/creditos/recargas",
    );
    return mapRechargeHistory(response);
  },
};
