import { useQuery } from "@tanstack/react-query";
import { homeRepository } from "../services/HomeRepository";

export const homeKeys = {
  all: ["home"] as const,
  summary: ["home", "summary"] as const,
};

export function useHomeSummaryQuery() {
  return useQuery({
    queryKey: homeKeys.summary,
    queryFn: homeRepository.getSummary,
    staleTime: 30_000,
  });
}
