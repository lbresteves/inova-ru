import { authenticatedRuApi } from "@features/Auth";
import { MealHistoryRepository } from "./MealHistoryRepository";

export const mealHistoryRepository = new MealHistoryRepository(authenticatedRuApi);
