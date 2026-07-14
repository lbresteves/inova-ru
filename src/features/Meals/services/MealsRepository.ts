import { httpClient } from "@shared/base";
import type { MealHistoryResponseDto } from "../types/MealHistoryDto";
import { mapMealHistory } from "../utils/mapMealHistory";

export const mealsRepository = {
  async getHistory() {
    const response = await httpClient.get<MealHistoryResponseDto>("/creditos/refeicoes");
    return mapMealHistory(response);
  },
};
