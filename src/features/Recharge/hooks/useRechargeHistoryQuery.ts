import { useQuery } from "@tanstack/react-query";
import { rechargeHistoryRepository } from "../services/RechargeHistoryRepository";

export function useRechargeHistoryQuery() {
  return useQuery({
    queryKey: ["recharge", "history"],
    queryFn: rechargeHistoryRepository.getHistory,
  });
}
