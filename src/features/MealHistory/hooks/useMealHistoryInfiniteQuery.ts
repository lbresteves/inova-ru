import { useSessionStore } from "@features/Auth";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { mealHistoryRepository } from "../services/mealHistoryServices";
import type { MealHistoryFilters, MealHistoryPage } from "../types/MealHistory";
import { mealHistoryKeys } from "../utils/mealHistoryKeys";

const PAGE_SIZE = 20;

type MealHistoryQueryKey = ReturnType<typeof mealHistoryKeys.list>;

export function useMealHistoryInfiniteQuery(filters: MealHistoryFilters) {
  const session = useSessionStore((state) => state.session);

  return useInfiniteQuery<
    MealHistoryPage,
    Error,
    InfiniteData<MealHistoryPage>,
    MealHistoryQueryKey,
    number
  >({
    enabled: Boolean(session?.subjectCpf),
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: lastAvailablePage } = lastPage.pagination;
      return currentPage < lastAvailablePage ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      mealHistoryRepository.getPage({
        filters,
        page: pageParam,
        perPage: PAGE_SIZE,
        signal,
      }),
    queryKey: mealHistoryKeys.list(session?.subjectCpf, filters, PAGE_SIZE),
  });
}
