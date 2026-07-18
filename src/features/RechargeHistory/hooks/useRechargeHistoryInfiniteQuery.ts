import { useSessionStore } from "@features/Auth";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { rechargeHistoryRepository } from "../services/rechargeHistoryServices";
import type {
  RechargeHistoryFilters,
  RechargeHistoryPage,
} from "../types/RechargeHistory";
import { rechargeHistoryKeys } from "../utils/rechargeHistoryKeys";

const PAGE_SIZE = 20;

type RechargeHistoryQueryKey = ReturnType<typeof rechargeHistoryKeys.list>;

export function useRechargeHistoryInfiniteQuery(filters: RechargeHistoryFilters) {
  const session = useSessionStore((state) => state.session);

  return useInfiniteQuery<
    RechargeHistoryPage,
    Error,
    InfiniteData<RechargeHistoryPage>,
    RechargeHistoryQueryKey,
    number
  >({
    enabled: Boolean(session?.subjectCpf),
    getNextPageParam: (lastPage) => {
      const { currentPage, lastPage: lastAvailablePage } = lastPage.pagination;
      return currentPage < lastAvailablePage ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      rechargeHistoryRepository.getPage({
        filters,
        page: pageParam,
        perPage: PAGE_SIZE,
        signal,
      }),
    queryKey: rechargeHistoryKeys.list(session?.subjectCpf, filters),
  });
}
