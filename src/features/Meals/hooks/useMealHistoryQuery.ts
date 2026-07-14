import { useQuery } from "@tanstack/react-query";
import { mealsRepository } from "../services/MealsRepository";

export function useMealHistoryQuery() {
  return useQuery({
    queryKey: ["meals", "history"],
    queryFn: mealsRepository.getHistory,
  });
}
